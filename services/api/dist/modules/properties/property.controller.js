"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const property_service_1 = require("./property.service");
const response_1 = require("../../utils/response");
class PropertyController {
    static async list(req, res) {
        try {
            const { properties, hasMore, nextCursor } = await property_service_1.PropertyService.listProperties(req.query);
            return (0, response_1.sendPaginated)(res, properties, {
                limit: Number(req.query.limit) || 20,
                hasMore,
                nextCursor,
            });
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'QUERY_FAILED', err.message, 500);
        }
    }
    static async getById(req, res) {
        try {
            const property = await property_service_1.PropertyService.getById(req.params.id, req.user?.uid);
            if (!property) {
                return (0, response_1.sendError)(res, 'NOT_FOUND', 'Property listing not found', 404);
            }
            return (0, response_1.sendSuccess)(res, property);
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'FETCH_FAILED', err.message, 500);
        }
    }
    static async create(req, res) {
        try {
            if (!req.user) {
                return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Authentication required', 401);
            }
            const property = await property_service_1.PropertyService.createProperty(req.user.uid, req.user.email.split('@')[0], Boolean(req.user.isOwnerVerified), req.body);
            return (0, response_1.sendSuccess)(res, property, 'Property created successfully', 201);
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'CREATE_FAILED', err.message, 500);
        }
    }
    static async update(req, res) {
        try {
            if (!req.user) {
                return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Authentication required', 401);
            }
            const isAdmin = req.user.roles.includes('admin');
            const updated = await property_service_1.PropertyService.updateProperty(req.params.id, req.user.uid, isAdmin, req.body);
            if (!updated) {
                return (0, response_1.sendError)(res, 'NOT_FOUND', 'Property not found', 404);
            }
            return (0, response_1.sendSuccess)(res, updated, 'Property updated successfully');
        }
        catch (err) {
            if (err.message === 'FORBIDDEN') {
                return (0, response_1.sendError)(res, 'FORBIDDEN', 'You do not have permission to edit this property', 403);
            }
            return (0, response_1.sendError)(res, 'UPDATE_FAILED', err.message, 500);
        }
    }
    static async delete(req, res) {
        try {
            if (!req.user) {
                return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Authentication required', 401);
            }
            const isAdmin = req.user.roles.includes('admin');
            const deleted = await property_service_1.PropertyService.deleteProperty(req.params.id, req.user.uid, isAdmin);
            if (!deleted) {
                return (0, response_1.sendError)(res, 'NOT_FOUND', 'Property not found', 404);
            }
            return (0, response_1.sendSuccess)(res, null, 'Property deleted successfully');
        }
        catch (err) {
            if (err.message === 'FORBIDDEN') {
                return (0, response_1.sendError)(res, 'FORBIDDEN', 'You do not have permission to delete this property', 403);
            }
            return (0, response_1.sendError)(res, 'DELETE_FAILED', err.message, 500);
        }
    }
}
exports.PropertyController = PropertyController;
