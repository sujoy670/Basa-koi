"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const response_1 = require("../utils/response");
function errorHandler(err, _req, res, _next) {
    console.error('Unhandled Server Error:', err);
    const isProduction = process.env.NODE_ENV === 'production';
    return (0, response_1.sendError)(res, 'INTERNAL_SERVER_ERROR', isProduction ? 'An unexpected internal server error occurred' : err.message, 500, isProduction ? undefined : err.stack);
}
