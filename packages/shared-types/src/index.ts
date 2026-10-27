/**
 * Basa-koi (HomeFinder BD) Shared Domain Types
 * Single source of truth for Web, Admin, and Backend API models
 */

// ==========================================
// 1. User & Authentication Types
// ==========================================

export type UserRole = 'tenant' | 'owner' | 'admin' | 'moderator';

export interface UserNotificationPreferences {
  newMessages: boolean;
  priceDrops: boolean;
  listingUpdates: boolean;
  marketing: boolean;
}

export interface UserProfile {
  id: string; // matches Firebase Auth UID
  email: string;
  displayName: string;
  phoneNumber?: string | null;
  photoURL?: string | null;
  roles: UserRole[];
  isPhoneVerified: boolean;
  isOwnerVerified: boolean;
  preferredCity?: string;
  fcmTokens?: string[];
  notificationSettings: UserNotificationPreferences;
  isSuspended: boolean;
  createdAt: string; // ISO 8601 string
  updatedAt: string;
}

// ==========================================
// 2. Property & Listing Types
// ==========================================

export type PropertyType =
  | 'apartment'
  | 'flat'
  | 'single_room'
  | 'sublet'
  | 'hostel'
  | 'mess'
  | 'family_house'
  | 'commercial';

export type SuitableFor = 'family' | 'bachelor' | 'any';

export type FurnishingStatus = 'unfurnished' | 'semi_furnished' | 'fully_furnished';

export type Facility =
  | 'wifi'
  | 'lift'
  | 'generator'
  | 'cctv'
  | 'parking'
  | 'gas_line'
  | 'cylinder_gas'
  | 'security_guard'
  | 'water_supply_24h'
  | 'balcony';

export type ListingStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rented'
  | 'expired'
  | 'rejected';

export interface PropertyImage {
  id: string;
  url: string;
  storagePath: string;
  isCover: boolean;
  order: number;
}

export interface PropertyLocation {
  division: string;
  district: string;
  thana: string;
  area: string;
  addressLine: string;
  latitude: number;
  longitude: number;
  geoHash: string;
  isExactLocationPublic: boolean;
}

export interface PropertyListing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhotoURL?: string | null;
  ownerPhone?: string | null;
  isOwnerVerified: boolean;
  title: string;
  description: string;
  monthlyRent: number; // In BDT (৳)
  securityDeposit: number;
  serviceCharge: number;
  propertyType: PropertyType;
  suitableFor: SuitableFor;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  floorNumber: number;
  totalFloors: number;
  squareFeet: number;
  furnishingStatus: FurnishingStatus;
  facilities: Facility[];
  images: PropertyImage[];
  location: PropertyLocation;
  availableFrom: string; // ISO 8601
  status: ListingStatus;
  rejectionReason?: string | null;
  viewCount: number;
  favoriteCount: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. Search & Filter Parameters
// ==========================================

export interface PropertyFilterParams {
  query?: string;
  city?: string;
  thana?: string;
  area?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: PropertyType;
  suitableFor?: SuitableFor;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: FurnishingStatus;
  facilities?: Facility[];
  availableFrom?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  sortBy?: 'rent_asc' | 'rent_desc' | 'created_desc' | 'views_desc';
  limit?: number;
  cursor?: string;
}

// ==========================================
// 4. Messaging & Chat Types
// ==========================================

export interface ChatParticipantInfo {
  id: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCoverImage: string;
  propertyMonthlyRent: number;
  participants: string[]; // [tenantUid, ownerUid]
  tenantId: string;
  ownerId: string;
  lastMessage: string;
  lastMessageSenderId: string;
  lastMessageAt: string;
  unreadCounts: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 5. Verification, Reports & Admin Logs
// ==========================================

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  userId: string;
  ownerName: string;
  nidNumber: string;
  documentUrls: string[];
  propertyHoldingNumber: string;
  status: VerificationStatus;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ReportReason =
  | 'fake_listing'
  | 'wrong_price'
  | 'already_rented'
  | 'inappropriate_content'
  | 'owner_unresponsive'
  | 'fraud_attempt';

export interface PropertyReport {
  id: string;
  reporterId: string;
  propertyId: string;
  propertyTitle: string;
  reason: ReportReason;
  details: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  resolvedBy?: string | null;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'property' | 'user' | 'report' | 'verification';
  targetId: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ==========================================
// 6. Standard API Responses
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total?: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string | null;
  };
}

