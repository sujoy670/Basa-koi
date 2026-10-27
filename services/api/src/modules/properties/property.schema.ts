import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(20).max(3000),
  monthlyRent: z.number().positive(),
  securityDeposit: z.number().nonnegative().default(0),
  serviceCharge: z.number().nonnegative().default(0),
  propertyType: z.enum([
    'apartment',
    'flat',
    'single_room',
    'sublet',
    'hostel',
    'mess',
    'family_house',
    'commercial',
  ]),
  suitableFor: z.enum(['family', 'bachelor', 'any']),
  bedrooms: z.number().int().min(1).max(20),
  bathrooms: z.number().int().min(1).max(20),
  balconies: z.number().int().min(0).max(10).default(0),
  floorNumber: z.number().int().min(0).max(50),
  totalFloors: z.number().int().min(1).max(60),
  squareFeet: z.number().positive(),
  furnishingStatus: z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']),
  facilities: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        id: z.string(),
        url: z.string().url(),
        storagePath: z.string(),
        isCover: z.boolean(),
        order: z.number().int(),
      })
    )
    .min(1, 'At least 1 photo is required'),
  location: z.object({
    division: z.string().default('Khulna'),
    district: z.string().default('Khulna'),
    thana: z.string().min(2),
    area: z.string().min(2),
    addressLine: z.string().min(5),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    geoHash: z.string().min(4),
    isExactLocationPublic: z.boolean().default(false),
  }),
  availableFrom: z.string().datetime(),
  status: z.enum(['draft', 'pending_approval']).default('pending_approval'),
});

export const updatePropertySchema = createPropertySchema.partial();

