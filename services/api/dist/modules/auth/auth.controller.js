"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const firebase_1 = require("../../config/firebase");
const response_1 = require("../../utils/response");
const notification_service_1 = require("../notifications/notification.service");
class AuthController {
    static async syncProfile(req, res) {
        try {
            const user = req.user;
            const userRef = firebase_1.db.collection('users').doc(user.uid);
            const doc = await userRef.get();
            const now = new Date().toISOString();
            if (!doc.exists) {
                const newProfile = {
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
                return (0, response_1.sendSuccess)(res, newProfile, 'Profile created', 201);
            }
            return (0, response_1.sendSuccess)(res, doc.data(), 'Profile retrieved');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'SYNC_FAILED', err.message, 500);
        }
    }
    static async registerFcmToken(req, res) {
        try {
            const { token } = req.body;
            if (!token)
                return (0, response_1.sendError)(res, 'BAD_REQUEST', 'FCM token is required', 400);
            await notification_service_1.NotificationService.registerToken(req.user.uid, token);
            return (0, response_1.sendSuccess)(res, null, 'FCM token registered');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'TOKEN_REGISTRATION_FAILED', err.message, 500);
        }
    }
    static async unregisterFcmToken(req, res) {
        try {
            const { token } = req.body;
            if (!token)
                return (0, response_1.sendError)(res, 'BAD_REQUEST', 'FCM token is required', 400);
            await notification_service_1.NotificationService.removeToken(req.user.uid, token);
            return (0, response_1.sendSuccess)(res, null, 'FCM token removed');
        }
        catch (err) {
            return (0, response_1.sendError)(res, 'TOKEN_REMOVAL_FAILED', err.message, 500);
        }
    }
}
exports.AuthController = AuthController;
