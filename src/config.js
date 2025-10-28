// define config variables from .env
export const APP_ENV = process.env.APP_ENV || 'dev';
export const APP_PORT = process.env.SERVER_PORT || 3000;
export const APP_TOKEN = process.env.APP_TOKEN || 'tapomix_puppeteer-srv_dev-token';
export const CHROME_EXECUTABLE = process.env.CHROME_EXECUTABLE || '/usr/bin/chromium';
export const KEEP_BROWSER_OPEN = process.env.KEEP_BROWSER_OPEN === 'true';
