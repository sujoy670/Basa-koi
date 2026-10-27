"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000').transform((val) => parseInt(val, 10)),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    FIREBASE_PROJECT_ID: zod_1.z.string().default('basa-koi-dev'),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().optional(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().optional(),
    ALLOWED_ORIGINS: zod_1.z.string().default('http://localhost:3000,http://localhost:3001'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('900000').transform((val) => parseInt(val, 10)),
    RATE_LIMIT_MAX: zod_1.z.string().default('200').transform((val) => parseInt(val, 10)),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
