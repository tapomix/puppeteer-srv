// server to generate pdf or screenshot from html with chromium
import express from "express";
import puppeteer from "puppeteer-core"; // <- use core version as we install manually chromium in Dockerfile

const app = express();
app.use(express.json({ limit: '10mb' }));

const APP_ENV = process.env.APP_ENV || 'dev';
const APP_PORT = process.env.SERVER_PORT || 3000;
const APP_TOKEN = process.env.APP_TOKEN || 'tapomix_puppeteer-srv_dev-token';
const CHROME_EXECUTABLE = process.env.CHROME_EXECUTABLE || '/usr/bin/chromium';
const KEEP_BROWSER_OPEN = process.env.KEEP_BROWSER_OPEN === 'true'; // compare to string ! (but now we got a boolean)

// use this function as middleware on required routes
const authenticateToken = (request, response, next) => {
    const token = request.headers['authorization'];

    if (!token) {
        console.log('[JS] [ERR] Missing token');

        return response.status(401).send({ error: 'Access denied, missing token !' });
    }

    if (token !== `Bearer ${APP_TOKEN}`) {
        console.log('[JS] [ERR] Invalid token');

        return response.status(403).send({ error: 'Access denied, invalid token !' });
    }

    next(); // execute next middleware if token is ok
};

let browserInstance;
// create browser instance on demand
const getBrowserInstance = async () => {
    if (!browserInstance || !KEEP_BROWSER_OPEN) {
        browserInstance = await createBrowser();
    }

    return browserInstance;
};

const createBrowser = async () => {
    return await puppeteer.launch({
        executablePath: CHROME_EXECUTABLE,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            // '--headless=new'
        ],
        dumpio: false, // set to true to see debug in docker logs
    });
};

const gracefulShutdown = async (reason = 'manual') => {
    console.log(`[JS] Graceful shutdown triggered (${reason})...`);

    if (browserInstance) {
        try {
            await browserInstance.close();
            console.log('[JS] Browser closed cleanly');
        } catch (err) {
            console.error('[ERR] Failed to close browser: ', err);
        } finally {
            browserInstance = null;
        }
    }
};

const processAction = async (action, request, response) => {
    const { html, options, viewport } = request.body;

    console.log('[JS] Processing new request # ' + action);
    // console.log('[JS] Options: ', JSON.stringify(options, null, 2));

    let page;
    let browser;

    try {
        browser = await getBrowserInstance();
        page = await browser.newPage();

        await page.setViewport(viewport || { width: 1920, height: 0 });
        await page.setContent(
            // split pages array with css page break
            // pages.join('<div style="page-break-after: always;"></div>'),
            html,
            { timeout: 30000, waitUntil: 'networkidle0' }
        );

        let buffer;
        let contentType;
        if ('pdf' === action) {
            contentType = 'application/pdf';
            buffer = await page.pdf(options || {});
        } else if ('screenshot' === action) {
            contentType = 'image/png'; // image/jpeg
            buffer = await page.screenshot(options || {});
        }

        if (!buffer || 0 === buffer.length) {
            throw new Error('Generated buffer is empty.');
        }

        response.setHeader('Content-Type', contentType);
        response.setHeader('Content-Length', buffer.length);
        response.send(buffer);
    } catch (err) {
        response.status(500).send({ error: err.message });
    } finally {
        if (page) {
            try {
                await page.close();
            } catch (err) {
                console.error('[ERR] Failed to close page: ', err);
            }
        }

        if (!KEEP_BROWSER_OPEN && browser) {
            try {
                await gracefulShutdown('processAction');
            } catch (err) {
                console.error('[ERR] Failed to close browser: ', err);
            }
        }
    }
};

app.post('/pdf', authenticateToken, async (request, response) => {
    await processAction('pdf', request, response);
});

app.post('/screenshot', authenticateToken, async (request, response) => {
    await processAction('screenshot', request, response);
});

app.listen(APP_PORT, () => {
    console.log(`[JS] [SRV] Puppeteer service running on ${APP_PORT} # ${APP_ENV}`);
    console.log('[JS] [SRV] Browser kept ? ' + (KEEP_BROWSER_OPEN ? 'V' : 'X'));

    if (KEEP_BROWSER_OPEN) {
        getBrowserInstance()
            .then(() => console.log('[JS] Browser is ready'))
            .catch(err => console.log('[JS] [SRV] Failed to prelaunch browser: ' + err))
        ;
    }
});

// close browser on server shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, async () => {
        await gracefulShutdown(signal);
        // just set exitCode instead of exit(0) to give time to finish closing process
        process.exitCode = 0;
    });
});
