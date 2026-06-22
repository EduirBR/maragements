import rateLimit from "express-rate-limit";
import response from "../utils/responses.js";
const max = Number(process.env.RATE_LIMIT_MAX) || 10;
const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 1000;

console.log(`[RATE_LIMITER] max=${max} windowMs=${windowMs}`);

const rateLimiter = rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message: "Too many requests, please try again later",
        data: null,
    },
    handler: (req, res) =>
        response(
            res,
            {
                error: true,
                message: "Too many requests, please try again later",
                data: null,
            },
            { statusCode: 429 },
        ),
});

export default rateLimiter;
