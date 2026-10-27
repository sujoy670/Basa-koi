"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
function validate(schema) {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return (0, response_1.sendError)(res, 'VALIDATION_ERROR', 'Request data validation failed', 422, error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                })));
            }
            return (0, response_1.sendError)(res, 'BAD_REQUEST', 'Invalid request body', 400);
        }
    };
}
