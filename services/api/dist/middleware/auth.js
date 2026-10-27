"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const firebase_1 = require("../config/firebase");
const response_1 = require("../utils/response");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Authentication token is required', 401);
    }
    const token = authHeader.split('Bearer ')[1].trim();
    // Dev bypass support for local automated tests
    if (process.env.NODE_ENV === 'development' && token === 'mock-dev-token') {
        req.user = {
            uid: 'dev-user-001',
            email: 'dev@basa-koi.com',
            roles: ['owner', 'tenant'],
            isOwnerVerified: true,
        };
        return next();
    }
    try {
        const decoded = await firebase_1.auth.verifyIdToken(token);
        const roles = decoded.roles || ['tenant'];
        req.user = {
            uid: decoded.uid,
            email: decoded.email || '',
            roles,
            isOwnerVerified: Boolean(decoded.isOwnerVerified),
        };
        next();
    }
    catch (error) {
        return (0, response_1.sendError)(res, 'INVALID_TOKEN', 'Token is expired or invalid', 401, error);
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.sendError)(res, 'UNAUTHORIZED', 'Authentication required', 401);
        }
        const hasPermission = req.user.roles.some((r) => allowedRoles.includes(r));
        if (!hasPermission) {
            return (0, response_1.sendError)(res, 'FORBIDDEN', `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`, 403);
        }
        next();
    };
}
