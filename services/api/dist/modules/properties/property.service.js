"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const firebase_1 = require("../../config/firebase");
const ngeohash_1 = __importDefault(require("ngeohash"));
class PropertyService {
    static collection = firebase_1.db.collection('properties');
    static async listProperties(params) {
        let query = this.collection.where('status', '==', 'approved');
        if (params.thana) {
            query = query.where('location.thana', '==', params.thana);
        }
        if (params.propertyType) {
            query = query.where('propertyType', '==', params.propertyType);
        }
        if (params.suitableFor) {
            query = query.where('suitableFor', '==', params.suitableFor);
        }
        // Default order
        query = query.orderBy('createdAt', 'desc');
        const limit = Math.min(params.limit || 20, 50);
        query = query.limit(limit + 1);
        if (params.cursor) {
            const cursorDoc = await this.collection.doc(params.cursor).get();
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        }
        const snapshot = await query.get();
        const hasMore = snapshot.docs.length > limit;
        const docs = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs;
        const properties = docs.map((doc) => {
            const data = doc.data();
            // Obfuscate exact location coordinates if private
            if (!data.location.isExactLocationPublic) {
                return {
                    ...data,
                    location: {
                        ...data.location,
                        addressLine: `${data.location.area}, ${data.location.thana}`,
                        // slight jitter for privacy
                        latitude: Math.round(data.location.latitude * 100) / 100,
                        longitude: Math.round(data.location.longitude * 100) / 100,
                    },
                };
            }
            return data;
        });
        const nextCursor = hasMore ? docs[docs.length - 1].id : null;
        return { properties, hasMore, nextCursor };
    }
    static async getById(id, viewerId) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        // View count increment (lazy debounce in real traffic)
        if (viewerId !== data.ownerId) {
            doc.ref.update({ viewCount: (data.viewCount || 0) + 1 }).catch(() => { });
        }
        if (!data.location.isExactLocationPublic && viewerId !== data.ownerId) {
            return {
                ...data,
                location: {
                    ...data.location,
                    addressLine: `${data.location.area}, ${data.location.thana}`,
                    latitude: Math.round(data.location.latitude * 100) / 100,
                    longitude: Math.round(data.location.longitude * 100) / 100,
                },
            };
        }
        return data;
    }
    static async createProperty(ownerId, ownerName, isOwnerVerified, input) {
        const docRef = this.collection.doc();
        const now = new Date().toISOString();
        const lat = input.location?.latitude || 22.8456;
        const lng = input.location?.longitude || 89.5403;
        const geoHash = ngeohash_1.default.encode(lat, lng, 7);
        const newProperty = {
            id: docRef.id,
            ownerId,
            ownerName,
            isOwnerVerified,
            title: input.title,
            description: input.description,
            monthlyRent: input.monthlyRent,
            securityDeposit: input.securityDeposit || 0,
            serviceCharge: input.serviceCharge || 0,
            propertyType: input.propertyType,
            suitableFor: input.suitableFor,
            bedrooms: input.bedrooms,
            bathrooms: input.bathrooms,
            balconies: input.balconies || 0,
            floorNumber: input.floorNumber || 0,
            totalFloors: input.totalFloors || 1,
            squareFeet: input.squareFeet,
            furnishingStatus: input.furnishingStatus,
            facilities: input.facilities || [],
            images: input.images || [],
            location: {
                ...input.location,
                geoHash,
            },
            availableFrom: input.availableFrom || now,
            status: input.status || 'pending_approval',
            viewCount: 0,
            favoriteCount: 0,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
            createdAt: now,
            updatedAt: now,
        };
        await docRef.set(newProperty);
        return newProperty;
    }
    static async updateProperty(propertyId, ownerId, isAdmin, updates) {
        const docRef = this.collection.doc(propertyId);
        const doc = await docRef.get();
        if (!doc.exists)
            return null;
        const existing = doc.data();
        if (existing.ownerId !== ownerId && !isAdmin) {
            throw new Error('FORBIDDEN');
        }
        // Protect administrative fields
        const safeUpdates = {
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        if (!isAdmin) {
            delete safeUpdates.isOwnerVerified;
            delete safeUpdates.viewCount;
            delete safeUpdates.favoriteCount;
            if (safeUpdates.status && !['draft', 'pending_approval', 'rented'].includes(safeUpdates.status)) {
                delete safeUpdates.status;
            }
        }
        await docRef.update(safeUpdates);
        const updated = await docRef.get();
        return updated.data();
    }
    static async deleteProperty(propertyId, ownerId, isAdmin) {
        const docRef = this.collection.doc(propertyId);
        const doc = await docRef.get();
        if (!doc.exists)
            return false;
        const data = doc.data();
        if (data.ownerId !== ownerId && !isAdmin) {
            throw new Error('FORBIDDEN');
        }
        await docRef.delete();
        return true;
    }
}
exports.PropertyService = PropertyService;
