// define config variables from .env

const DEFAULT_TOKEN = 'tapomix_puppeteer-srv_dev-token';

export const APP_ENV = process.env.APP_ENV || 'dev';

// APP_PORT must be set (all environments)
if (!process.env.SERVER_PORT) {
    console.error('[FATAL] SERVER_PORT must be set !');
    process.exit(1);
}
export const APP_PORT = parseInt(process.env.SERVER_PORT, 10);

// APP_TOKEN must be set (+changed from default) for production
if (
    APP_ENV === 'prod'
    && (!process.env.APP_TOKEN || process.env.APP_TOKEN === DEFAULT_TOKEN)
) {
    console.error('[FATAL] APP_TOKEN must be set !');
    process.exit(1);
}
export const APP_TOKEN = process.env.APP_TOKEN || DEFAULT_TOKEN;

export const CHROME_EXECUTABLE = process.env.CHROME_EXECUTABLE || '/usr/bin/chromium';
export const KEEP_BROWSER_OPEN = process.env.KEEP_BROWSER_OPEN === 'true'; // string compare !

export const RATE_LIMIT_GLOBAL_WINDOW = parseInt(process.env.RATE_LIMIT_GLOBAL_WINDOW || '2', 10);
export const RATE_LIMIT_GLOBAL_MAX = parseInt(process.env.RATE_LIMIT_GLOBAL_MAX || '5', 10);
export const RATE_LIMIT_API_WINDOW = parseInt(process.env.RATE_LIMIT_API_WINDOW || '1', 10);
export const RATE_LIMIT_API_MAX = parseInt(process.env.RATE_LIMIT_API_MAX || '3', 10);
