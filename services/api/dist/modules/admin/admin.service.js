"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const firebase_1 = require("../../config/firebase");
const notification_service_1 = require("../notifications/notification.service");
class AdminService {
    static async getOverviewStats() {
        const propertiesSnap = await firebase_1.db.collection('properties').get();
        const usersSnap = await firebase_1.db.collection('users').get();
        const pendingSnap = await firebase_1.db.collection('properties').where('status', '==', 'pending_approval').get();
        const reportsSnap = await firebase_1.db.collection('reports').where('status', '==', 'pending').get();
        return {
            totalProperties: propertiesSnap.size,
            totalUsers: usersSnap.size,
            pendingApprovals: pendingSnap.size,
            pendingReports: reportsSnap.size,
        };
    }
    static async approveProperty(propertyId, adminId, adminEmail) {
        const docRef = firebase_1.db.collection('properties').doc(propertyId);
        const doc = await docRef.get();
        if (!doc.exists)
            throw new Error('NOT_FOUND');
        const property = doc.data();
        const now = new Date().toISOString();
        await docRef.update({
            status: 'approved',
            rejectionReason: null,
            updatedAt: now,
        });
        // Record admin audit log
        await firebase_1.db.collection('adminLogs').add({
            adminId,
            adminEmail,
            action: 'APPROVE_PROPERTY',
            targetType: 'property',
            targetId: propertyId,
            details: { title: property.title },
            timestamp: now,
        });
        // Notify owner via FCM (Node.js direct)
        notification_service_1.NotificationService.sendNotification({
            recipientUserId: property.ownerId,
            category: 'property_approved',
            title: 'Listing Approved! 🎉',
            body: `Your property "${property.title}" is now live and visible to tenants.`,
            data: { propertyId },
        }).catch(console.error);
        return { id: propertyId, status: 'approved' };
    }
    static async rejectProperty(propertyId, reason, adminId, adminEmail) {
        const docRef = firebase_1.db.collection('properties').doc(propertyId);
        const doc = await docRef.get();
        if (!doc.exists)
            throw new Error('NOT_FOUND');
        const property = doc.data();
        const now = new Date().toISOString();
        await docRef.update({
            status: 'rejected',
            rejectionReason: reason,
            updatedAt: now,
        });
        await firebase_1.db.collection('adminLogs').add({
            adminId,
            adminEmail,
            action: 'REJECT_PROPERTY',
            targetType: 'property',
            targetId: propertyId,
            details: { reason, title: property.title },
            timestamp: now,
        });
        notification_service_1.NotificationService.sendNotification({
            recipientUserId: property.ownerId,
            category: 'property_rejected',
            title: 'Listing Needs Attention',
            body: `Your listing "${property.title}" was rejected: ${reason}`,
            data: { propertyId, reason },
        }).catch(console.error);
        return { id: propertyId, status: 'rejected', reason };
    }
    static async verifyOwner(userId, isVerified, adminId, adminEmail) {
        const userRef = firebase_1.db.collection('users').doc(userId);
        const now = new Date().toISOString();
        await userRef.update({
            isOwnerVerified: isVerified,
            updatedAt: now,
        });
        await firebase_1.db.collection('adminLogs').add({
            adminId,
            adminEmail,
            action: isVerified ? 'VERIFY_OWNER' : 'UNVERIFY_OWNER',
            targetType: 'user',
            targetId: userId,
            details: { isVerified },
            timestamp: now,
        });
        return { userId, isOwnerVerified: isVerified };
    }
}
exports.AdminService = AdminService;
