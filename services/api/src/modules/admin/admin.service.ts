import { db } from '../../config/firebase';
import { NotificationService } from '../notifications/notification.service';
import { PropertyListing } from '@basa-koi/shared-types';

export class AdminService {
  static async getOverviewStats() {
    const propertiesSnap = await db.collection('properties').get();
    const usersSnap = await db.collection('users').get();
    const pendingSnap = await db.collection('properties').where('status', '==', 'pending_approval').get();
    const reportsSnap = await db.collection('reports').where('status', '==', 'pending').get();

    return {
      totalProperties: propertiesSnap.size,
      totalUsers: usersSnap.size,
      pendingApprovals: pendingSnap.size,
      pendingReports: reportsSnap.size,
    };
  }

  static async approveProperty(propertyId: string, adminId: string, adminEmail: string) {
    const docRef = db.collection('properties').doc(propertyId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('NOT_FOUND');

    const property = doc.data() as PropertyListing;
    const now = new Date().toISOString();

    await docRef.update({
      status: 'approved',
      rejectionReason: null,
      updatedAt: now,
    });

    // Record admin audit log
    await db.collection('adminLogs').add({
      adminId,
      adminEmail,
      action: 'APPROVE_PROPERTY',
      targetType: 'property',
      targetId: propertyId,
      details: { title: property.title },
      timestamp: now,
    });

    // Notify owner via FCM (Node.js direct)
    NotificationService.sendNotification({
      recipientUserId: property.ownerId,
      category: 'property_approved',
      title: 'Listing Approved! 🎉',
      body: `Your property "${property.title}" is now live and visible to tenants.`,
      data: { propertyId },
    }).catch(console.error);

    return { id: propertyId, status: 'approved' };
  }

  static async rejectProperty(propertyId: string, reason: string, adminId: string, adminEmail: string) {
    const docRef = db.collection('properties').doc(propertyId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('NOT_FOUND');

    const property = doc.data() as PropertyListing;
    const now = new Date().toISOString();

    await docRef.update({
      status: 'rejected',
      rejectionReason: reason,
      updatedAt: now,
    });

    await db.collection('adminLogs').add({
      adminId,
      adminEmail,
      action: 'REJECT_PROPERTY',
      targetType: 'property',
      targetId: propertyId,
      details: { reason, title: property.title },
      timestamp: now,
    });

    NotificationService.sendNotification({
      recipientUserId: property.ownerId,
      category: 'property_rejected',
      title: 'Listing Needs Attention',
      body: `Your listing "${property.title}" was rejected: ${reason}`,
      data: { propertyId, reason },
    }).catch(console.error);

    return { id: propertyId, status: 'rejected', reason };
  }

  static async verifyOwner(userId: string, isVerified: boolean, adminId: string, adminEmail: string) {
    const userRef = db.collection('users').doc(userId);
    const now = new Date().toISOString();

    await userRef.update({
      isOwnerVerified: isVerified,
      updatedAt: now,
    });

    await db.collection('adminLogs').add({
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

