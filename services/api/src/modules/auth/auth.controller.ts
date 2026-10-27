import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { sendSuccess, sendError } from '../../utils/response';
import { NotificationService } from '../notifications/notification.service';
import { UserProfile } from '@basa-koi/shared-types';

export class AuthController {
  static async syncProfile(req: Request, res: Response) {
    try {
      const user = req.user!;
      const userRef = db.collection('users').doc(user.uid);
      const doc = await userRef.get();
      const now = new Date().toISOString();

      if (!doc.exists) {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email,
          displayName: user.email.split('@')[0],
          roles: ['tenant'],
          isPhoneVerified: false,
          isOwnerVerified: false,
          notificationSettings: {
            newMessages: true,
            priceDrops: true,
            listingUpdates: true,
            marketing: false,
          },
          isSuspended: false,
          createdAt: now,
          updatedAt: now,
        };
        await userRef.set(newProfile);
        return sendSuccess(res, newProfile, 'Profile created', 201);
      }

      return sendSuccess(res, doc.data(), 'Profile retrieved');
    } catch (err: any) {
      return sendError(res, 'SYNC_FAILED', err.message, 500);
    }
  }

  static async registerFcmToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) return sendError(res, 'BAD_REQUEST', 'FCM token is required', 400);

      await NotificationService.registerToken(req.user!.uid, token);
      return sendSuccess(res, null, 'FCM token registered');
    } catch (err: any) {
      return sendError(res, 'TOKEN_REGISTRATION_FAILED', err.message, 500);
    }
  }

  static async unregisterFcmToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) return sendError(res, 'BAD_REQUEST', 'FCM token is required', 400);

      await NotificationService.removeToken(req.user!.uid, token);
      return sendSuccess(res, null, 'FCM token removed');
    } catch (err: any) {
      return sendError(res, 'TOKEN_REMOVAL_FAILED', err.message, 500);
    }
  }
}

