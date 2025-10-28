import rateLimit from "express-rate-limit";

// global limiter (calling the server)
const globalLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // N * 60 * 1000 = N minutes
    max: 5, // limit each IP to N requests in window range
    message: { error: 'Too many requests.' },
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    // enable RateLimit header + disable X-Rate-Limit
    standardHeaders: true,
    legacyHeaders: false,
});

// api limiter (calling a specific route)
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // N * 60 * 1000 = N minutes
    max: 3, // limit each IP to N requests in window range
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
