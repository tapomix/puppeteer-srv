import rateLimit from "express-rate-limit";

import {
    RATE_LIMIT_GLOBAL_WINDOW,
    RATE_LIMIT_GLOBAL_MAX,
    RATE_LIMIT_API_WINDOW,
    RATE_LIMIT_API_MAX,
} from "../config.js";

// limit each IP to N (=max) requests in a window range of N (=window) minutes (as we * 60 * 1000)

// global limiter (calling the server)
const globalLimiter = rateLimit({
    windowMs: RATE_LIMIT_GLOBAL_WINDOW * 60 * 1000,
    max: RATE_LIMIT_GLOBAL_MAX,
    message: { error: 'Too many requests.' },
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    // enable RateLimit header + disable X-Rate-Limit
    standardHeaders: true,
    legacyHeaders: false,
});

// api limiter (calling a specific route)
const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_API_WINDOW * 60 * 1000,
    max: RATE_LIMIT_API_MAX,
    message: { error: 'Too many api calls.' },
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    // enable RateLimit header + disable X-Rate-Limit
    standardHeaders: true,
    legacyHeaders: false,
});

export {
    globalLimiter,
    apiLimiter,
};
