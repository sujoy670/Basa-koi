import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { sendSuccess, sendError } from '../../utils/response';
import { z } from 'zod';

const rejectSchema = z.object({
  reason: z.string().min(5).max(500),
});

const verifySchema = z.object({
  isVerified: z.boolean(),
});

export class AdminController {
  static async getOverview(_req: Request, res: Response) {
    try {
      const stats = await AdminService.getOverviewStats();
      return sendSuccess(res, stats);
    } catch (err: any) {
      return sendError(res, 'STATS_FAILED', err.message, 500);
    }
  }

  static async approve(req: Request, res: Response) {
    try {
      const result = await AdminService.approveProperty(
        req.params.id,
        req.user!.uid,
        req.user!.email
      );
      return sendSuccess(res, result, 'Property approved');
    } catch (err: any) {
      return sendError(res, 'APPROVE_FAILED', err.message, 500);
    }
  }

  static async reject(req: Request, res: Response) {
    try {
      const { reason } = rejectSchema.parse(req.body);
      const result = await AdminService.rejectProperty(
        req.params.id,
        reason,
        req.user!.uid,
        req.user!.email
      );
      return sendSuccess(res, result, 'Property rejected');
    } catch (err: any) {
      return sendError(res, 'REJECT_FAILED', err.message, 500);
    }
  }

  static async verifyOwner(req: Request, res: Response) {
    try {
      const { isVerified } = verifySchema.parse(req.body);
      const result = await AdminService.verifyOwner(
        req.params.userId,
        isVerified,
        req.user!.uid,
        req.user!.email
      );
      return sendSuccess(res, result, 'Owner verification status updated');
    } catch (err: any) {
      return sendError(res, 'VERIFY_FAILED', err.message, 500);
    }
  }
}

