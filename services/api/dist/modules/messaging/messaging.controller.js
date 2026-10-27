"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingController = void 0;
const messaging_service_1 = require("./messaging.service");
const response_1 = require("../../utils/response");
const zod_1 = require("zod");
const createChatSchema = zod_1.z.object({
    propertyId: zod_1.z.string().min(1),
});
const sendMessageSchema = zod_1.z.object({
    text: zod_1.z.string().min(1).max(2000),
});
class MessagingController {
    static async getOrCreate(req, res) {
        try {
            const { propertyId } = createChatSchema.parse(req.body);
            const chat = await messaging_service_1.MessagingService.getOrCreateChat(req.user.uid, propertyId);
            return (0, response_1.sendSuccess)(res, chat, 'Chat retrieved or initiated', 200);
        }
        catch (err) {
            if (err.message === 'CANNOT_CHAT_WITH_SELF') {
                return (0, response_1.sendError)(res, 'BAD_REQUEST', 'You cannot message your own listing', 400);
            }
            return (0, response_1.sendError)(res, 'CHAT_ERROR', err.message, 500);
        }
    }
    static async sendMessage(req, res) {
        try {
            const { text } = sendMessageSchema.parse(req.body);
            const senderName = req.user.email.split('@')[0];
            const message = await messaging_service_1.MessagingService.sendMessage(req.params.chatId, req.user.uid, senderName, text);
            return (0, response_1.sendSuccess)(res, message, 'Message sent', 201);
        }
        catch (err) {
            if (err.message === 'FORBIDDEN') {
                return (0, response_1.sendError)(res, 'FORBIDDEN', 'You are not a participant in this conversation', 403);
            }
            return (0, response_1.sendError)(res, 'SEND_FAILED', err.message, 500);
        }
    }
    static async markRead(req, res) {
        try {
            await messaging_service_1.MessagingService.markAsRead(req.params.chatId, req.user.uid);
            return (0, response_1.sendSuccess)(res, null, 'Chat marked read');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'READ_FAILED', err.message, 500);
        }
    }
}
exports.MessagingController = MessagingController;
