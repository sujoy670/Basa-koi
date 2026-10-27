"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const response_1 = require("../../utils/response");
const zod_1 = require("zod");
const rejectSchema = zod_1.z.object({
    reason: zod_1.z.string().min(5).max(500),
});
const verifySchema = zod_1.z.object({
    isVerified: zod_1.z.boolean(),
});
class AdminController {
    static async getOverview(_req, res) {
        try {
            const stats = await admin_service_1.AdminService.getOverviewStats();
            return (0, response_1.sendSuccess)(res, stats);
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'STATS_FAILED', err.message, 500);
        }
    }
    static async approve(req, res) {
        try {
            const result = await admin_service_1.AdminService.approveProperty(req.params.id, req.user.uid, req.user.email);
            return (0, response_1.sendSuccess)(res, result, 'Property approved');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'APPROVE_FAILED', err.message, 500);
        }
    }
    static async reject(req, res) {
        try {
            const { reason } = rejectSchema.parse(req.body);
            const result = await admin_service_1.AdminService.rejectProperty(req.params.id, reason, req.user.uid, req.user.email);
            return (0, response_1.sendSuccess)(res, result, 'Property rejected');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'REJECT_FAILED', err.message, 500);
        }
    }
    static async verifyOwner(req, res) {
        try {
            const { isVerified } = verifySchema.parse(req.body);
            const result = await admin_service_1.AdminService.verifyOwner(req.params.userId, isVerified, req.user.uid, req.user.email);
            return (0, response_1.sendSuccess)(res, result, 'Owner verification status updated');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'VERIFY_FAILED', err.message, 500);
        }
    }
}
exports.AdminController = AdminController;
