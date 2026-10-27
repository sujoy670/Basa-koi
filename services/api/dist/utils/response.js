"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendPaginated = sendPaginated;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Success', statusCode = 200) {
    const payload = {
        success: true,
        message,
        data,
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
    return res.status(statusCode).json(payload);
}
function sendPaginated(res, items, pagination, message = 'Success', statusCode = 200) {
    const payload = {
        success: true,
        message,
        data: items,
        pagination,
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
    return res.status(statusCode).json(payload);
}
function sendError(res, code, message, statusCode = 400, details) {
    const payload = {
        success: false,
        message,
        error: {
            code,
            message,
            details,
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
    return res.status(statusCode).json(payload);
}
