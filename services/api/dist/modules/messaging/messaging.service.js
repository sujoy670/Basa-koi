"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const firebase_1 = require("../../config/firebase");
const notification_service_1 = require("../notifications/notification.service");
class MessagingService {
    static chats = firebase_1.db.collection('chats');
    static async getOrCreateChat(tenantId, propertyId) {
        const propertyDoc = await firebase_1.db.collection('properties').doc(propertyId).get();
        if (!propertyDoc.exists) {
            throw new Error('PROPERTY_NOT_FOUND');
        }
        const property = propertyDoc.data();
        const ownerId = property.ownerId;
        if (tenantId === ownerId) {
            throw new Error('CANNOT_CHAT_WITH_SELF');
        }
        // Check existing chat for this property + tenant
        const existing = await this.chats
            .where('propertyId', '==', propertyId)
            .where('tenantId', '==', tenantId)
            .limit(1)
            .get();
        if (!existing.empty) {
            return existing.docs[0].data();
        }
        const docRef = this.chats.doc();
        const now = new Date().toISOString();
        const newChat = {
            id: docRef.id,
            propertyId,
            propertyTitle: property.title,
            propertyCoverImage: property.images?.[0]?.url || '',
            propertyMonthlyRent: property.monthlyRent,
            participants: [tenantId, ownerId],
            tenantId,
            ownerId,
            lastMessage: '',
            lastMessageSenderId: '',
            lastMessageAt: now,
            unreadCounts: {
                [tenantId]: 0,
                [ownerId]: 0,
            },
            createdAt: now,
            updatedAt: now,
        };
        await docRef.set(newChat);
        return newChat;
    }
    static async sendMessage(chatId, senderId, senderName, text) {
        const chatDoc = await this.chats.doc(chatId).get();
        if (!chatDoc.exists) {
            throw new Error('CHAT_NOT_FOUND');
        }
        const chat = chatDoc.data();
        if (!chat.participants.includes(senderId)) {
            throw new Error('FORBIDDEN');
        }
        const recipientId = chat.participants.find((p) => p !== senderId);
        if (!recipientId)
            throw new Error('RECIPIENT_NOT_FOUND');
        const messageRef = chatDoc.ref.collection('messages').doc();
        const now = new Date().toISOString();
        const message = {
            id: messageRef.id,
            chatId,
            senderId,
            senderName,
            text,
            isRead: false,
            createdAt: now,
        };
        await firebase_1.db.runTransaction(async (transaction) => {
            transaction.set(messageRef, message);
            transaction.update(chatDoc.ref, {
                lastMessage: text,
                lastMessageSenderId: senderId,
                lastMessageAt: now,
                [`unreadCounts.${recipientId}`]: (chat.unreadCounts?.[recipientId] || 0) + 1,
                updatedAt: now,
            });
        });
        // Dispatch FCM push notification directly from Node.js (No Cloud Functions)
        notification_service_1.NotificationService.sendNotification({
            recipientUserId: recipientId,
            category: 'new_message',
            title: `New message from ${senderName}`,
            body: text.length > 80 ? `${text.substring(0, 77)}...` : text,
            data: {
                chatId,
                propertyId: chat.propertyId,
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
            },
        }).catch((err) => console.error('Push notification trigger error:', err));
        return message;
    }
    static async markAsRead(chatId, userId) {
        const chatDoc = await this.chats.doc(chatId).get();
        if (!chatDoc.exists)
            return;
        await chatDoc.ref.update({
            [`unreadCounts.${userId}`]: 0,
            updatedAt: new Date().toISOString(),
        });
    }
}
exports.MessagingService = MessagingService;
