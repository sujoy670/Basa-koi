import { Request, Response } from 'express';
import { MessagingService } from './messaging.service';
import { sendSuccess, sendError } from '../../utils/response';
import { z } from 'zod';

const createChatSchema = z.object({
  propertyId: z.string().min(1),
});

const sendMessageSchema = z.object({
  text: z.string().min(1).max(2000),
});

export class MessagingController {
  static async getOrCreate(req: Request, res: Response) {
    try {
      const { propertyId } = createChatSchema.parse(req.body);
      const chat = await MessagingService.getOrCreateChat(req.user!.uid, propertyId);
      return sendSuccess(res, chat, 'Chat retrieved or initiated', 200);
    } catch (err: any) {
      if (err.message === 'CANNOT_CHAT_WITH_SELF') {
        return sendError(res, 'BAD_REQUEST', 'You cannot message your own listing', 400);
      }
      return sendError(res, 'CHAT_ERROR', err.message, 500);
    }
  }

  static async sendMessage(req: Request, res: Response) {
    try {
      const { text } = sendMessageSchema.parse(req.body);
      const senderName = req.user!.email.split('@')[0];
      const message = await MessagingService.sendMessage(
        req.params.chatId,
        req.user!.uid,
        senderName,
        text
      );
      return sendSuccess(res, message, 'Message sent', 201);
    } catch (err: any) {
      if (err.message === 'FORBIDDEN') {
        return sendError(res, 'FORBIDDEN', 'You are not a participant in this conversation', 403);
      }
      return sendError(res, 'SEND_FAILED', err.message, 500);
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      await MessagingService.markAsRead(req.params.chatId, req.user!.uid);
      return sendSuccess(res, null, 'Chat marked read');
    } catch (err: any) {
      return sendError(res, 'READ_FAILED', err.message, 500);
    }
  }
}

