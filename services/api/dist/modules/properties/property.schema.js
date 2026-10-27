"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
exports.createPropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(120),
    description: zod_1.z.string().min(20).max(3000),
    monthlyRent: zod_1.z.number().positive(),
    securityDeposit: zod_1.z.number().nonnegative().default(0),
    serviceCharge: zod_1.z.number().nonnegative().default(0),
    propertyType: zod_1.z.enum([
        'apartment',
        'flat',
        'single_room',
        'sublet',
        'hostel',
        'mess',
        'family_house',
        'commercial',
    ]),
    suitableFor: zod_1.z.enum(['family', 'bachelor', 'any']),
    bedrooms: zod_1.z.number().int().min(1).max(20),
    bathrooms: zod_1.z.number().int().min(1).max(20),
    balconies: zod_1.z.number().int().min(0).max(10).default(0),
    floorNumber: zod_1.z.number().int().min(0).max(50),
    totalFloors: zod_1.z.number().int().min(1).max(60),
    squareFeet: zod_1.z.number().positive(),
    furnishingStatus: zod_1.z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']),
    facilities: zod_1.z.array(zod_1.z.string()).default([]),
    images: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        url: zod_1.z.string().url(),
        storagePath: zod_1.z.string(),
        isCover: zod_1.z.boolean(),
        order: zod_1.z.number().int(),
    }))
        .min(1, 'At least 1 photo is required'),
    location: zod_1.z.object({
        division: zod_1.z.string().default('Khulna'),
        district: zod_1.z.string().default('Khulna'),
        thana: zod_1.z.string().min(2),
        area: zod_1.z.string().min(2),
        addressLine: zod_1.z.string().min(5),
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        geoHash: zod_1.z.string().min(4),
        isExactLocationPublic: zod_1.z.boolean().default(false),
    }),
    availableFrom: zod_1.z.string().datetime(),
    status: zod_1.z.enum(['draft', 'pending_approval']).default('pending_approval'),
});
exports.updatePropertySchema = exports.createPropertySchema.partial();
