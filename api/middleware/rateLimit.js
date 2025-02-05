const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

module.exports = { rateLimiter };