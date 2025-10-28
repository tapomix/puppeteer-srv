// server to generate pdf or screenshot from html with chromium
import express from "express";

import { APP_ENV, APP_PORT, KEEP_BROWSER_OPEN } from "./config.js";

import { authenticateToken } from "./middlewares/auth.js";
import { globalLimiter, apiLimiter } from "./middlewares/limiter.js";

import { getBrowserInstance, gracefulShutdown, processAction } from "./services/browser.js";

const app = express();

// public routes (before auth middleware)
app.get('/health', async (_request, response) => {
    try {
        const status = {
            status: 'up',
            browser: 'closed',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
        };

        if (KEEP_BROWSER_OPEN) {
            const browser = await getBrowserInstance();
            status.browser = browser.isConnected() ? 'connected' : 'disconnected';
        }

        response.status(200).json(status);
    } catch (error) {
        response.status(503).json({
            status: 'error',
            message: error.message
        });
    }
});

// apply global middlewares
app.use(express.json({ limit: '2mb' }));
app.use(globalLimiter);
app.use(authenticateToken);
app.use(apiLimiter);

// protected routes (after middlewares)
app.post('/pdf', async (request, response) => {
    await processAction('pdf', request, response);
});

app.post('/screenshot', async (request, response) => {
    await processAction('screenshot', request, response);
});

app.listen(APP_PORT, () => {
    console.log(`[SRV] Puppeteer service running on ${APP_PORT} # ${APP_ENV}`);
    console.log('[SRV] Browser kept ? ' + (KEEP_BROWSER_OPEN ? 'V' : 'X'));

    if (KEEP_BROWSER_OPEN) {
        getBrowserInstance()
            .then(() => console.log('Browser is ready.'))
            .catch(err => console.log('[ERR] Failed to prelaunch browser: ' + err))
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
