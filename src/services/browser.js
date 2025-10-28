import puppeteer from "puppeteer-core"; // <- use core version as we install manually chromium in Dockerfile

import { CHROME_EXECUTABLE, KEEP_BROWSER_OPEN } from "../config.js";

let browserInstance;

// Create browser instance on demand
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
            console.log('Browser closed cleanly.');
        } catch (err) {
            console.error('[ERR] Failed to close browser: ', err);
        } finally {
            browserInstance = null;
        }
    }
};

// Process PDF or Screenshot generation
const processAction = async (action, request, response) => {
    const { html, options, viewport } = request.body;

    console.log('[JS] Processing new request # ' + action);
    // console.log('Options: ', JSON.stringify(options, null, 2));

    let page;
    let browser;

    try {
        browser = await getBrowserInstance();
        page = await browser.newPage();

        await page.setViewport(viewport || { width: 1920, height: 0 });

        await page.setContent(html, { timeout: 30000, waitUntil: 'networkidle0' });

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
        console.error('[ERR] Failed to process action: ', err);
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

export {
    getBrowserInstance,
    gracefulShutdown,
    processAction,
};
