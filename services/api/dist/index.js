"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const app = (0, express_1.default)();
// Security and utility middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
    credentials: true,
}));
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '2mb' }));
if (env_1.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
// Global rate limiting
app.use('/api', rateLimiter_1.globalRateLimiter);
// API Routes
app.use('/api/v1', routes_1.default);
// Centralized error handler
app.use(errorHandler_1.errorHandler);
if (env_1.env.NODE_ENV !== 'test') {
    app.listen(env_1.env.PORT, () => {
        console.log(`🚀 Basa-koi API Server running on port ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
    });
}
exports.default = app;
