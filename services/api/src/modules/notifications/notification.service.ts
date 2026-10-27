import { db, messaging } from '../../config/firebase';
import * as admin from 'firebase-admin';

export interface PushNotificationPayload {
  recipientUserId: string;
  category: 'new_message' | 'property_approved' | 'property_rejected' | 'price_drop' | 'admin_announcement';
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class NotificationService {
  /**
   * Registers a device FCM token to the user document
   */
  static async registerToken(userId: string, token: string): Promise<void> {
    const userRef = db.collection('users').doc(userId);
    await userRef.set(
      {
        fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  /**
   * Removes a device FCM token from the user document (on logout or expiration)
   */
  static async removeToken(userId: string, token: string): Promise<void> {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Dispatches push notification via FCM to user devices
   */
  static async sendNotification(payload: PushNotificationPayload): Promise<{ delivered: number; failed: number }> {
    const userDoc = await db.collection('users').doc(payload.recipientUserId).get();
    if (!userDoc.exists) {
      return { delivered: 0, failed: 0 };
    }

    const userData = userDoc.data();
    const tokens: string[] = userData?.fcmTokens || [];
    const settings = userData?.notificationSettings || {};

    // Category preference check
    if (payload.category === 'new_message' && settings.newMessages === false) {
      return { delivered: 0, failed: 0 };
    }
    if (payload.category === 'price_drop' && settings.priceDrops === false) {
      return { delivered: 0, failed: 0 };
    }

    if (!tokens.length) {
      return { delivered: 0, failed: 0 };
    }

    const messagePayload: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        category: payload.category,
        timestamp: new Date().toISOString(),
        ...(payload.data || {}),
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'homefinder_bd_alerts',
        },
      },
    };

    try {
      const response = await messaging.sendEachForMulticast(messagePayload);
      const invalidTokens: string[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokens[idx]);
          }
        }
      });

      // Cleanup invalid/expired tokens asynchronously
      if (invalidTokens.length > 0) {
        await db.collection('users').doc(payload.recipientUserId).update({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
        });
      }

      return {
        delivered: response.successCount,
        failed: response.failureCount,
      };
    } catch (err) {
      console.error('FCM Multicast error:', err);
      return { delivered: 0, failed: tokens.length };
    }
  }
}

