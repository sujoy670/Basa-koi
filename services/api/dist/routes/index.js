"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_routes_1 = __importDefault(require("../modules/properties/property.routes"));
const messaging_routes_1 = __importDefault(require("../modules/messaging/messaging.routes"));
const admin_routes_1 = __importDefault(require("../modules/admin/admin.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const router = (0, express_1.Router)();
// Health Check
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'Basa-koi (HomeFinder BD) REST API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
router.use('/auth', auth_routes_1.default);
router.use('/properties', property_routes_1.default);
router.use('/chats', messaging_routes_1.default);
router.use('/admin', admin_routes_1.default);
exports.default = router;
