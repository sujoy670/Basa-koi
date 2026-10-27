"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const firebase_1 = require("../../config/firebase");
const admin = __importStar(require("firebase-admin"));
class NotificationService {
    /**
     * Registers a device FCM token to the user document
     */
    static async registerToken(userId, token) {
        const userRef = firebase_1.db.collection('users').doc(userId);
        await userRef.set({
            fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
            updatedAt: new Date().toISOString(),
        }, { merge: true });
    }
    /**
     * Removes a device FCM token from the user document (on logout or expiration)
     */
    static async removeToken(userId, token) {
        const userRef = firebase_1.db.collection('users').doc(userId);
        await userRef.update({
            fcmTokens: admin.firestore.FieldValue.arrayRemove(token),
            updatedAt: new Date().toISOString(),
        });
    }
    /**
     * Dispatches push notification via FCM to user devices
     */
    static async sendNotification(payload) {
        const userDoc = await firebase_1.db.collection('users').doc(payload.recipientUserId).get();
        if (!userDoc.exists) {
            return { delivered: 0, failed: 0 };
        }
        const userData = userDoc.data();
        const tokens = userData?.fcmTokens || [];
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
        const messagePayload = {
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
            const response = await firebase_1.messaging.sendEachForMulticast(messagePayload);
            const invalidTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    const errCode = resp.error?.code;
                    if (errCode === 'messaging/invalid-registration-token' ||
                        errCode === 'messaging/registration-token-not-registered') {
                        invalidTokens.push(tokens[idx]);
                    }
                }
            });
            // Cleanup invalid/expired tokens asynchronously
            if (invalidTokens.length > 0) {
                await firebase_1.db.collection('users').doc(payload.recipientUserId).update({
                    fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens),
                });
            }
            return {
                delivered: response.successCount,
                failed: response.failureCount,
            };
        }
        catch (err) {
            console.error('FCM Multicast error:', err);
            return { delivered: 0, failed: tokens.length };
        }
    }
}
exports.NotificationService = NotificationService;
