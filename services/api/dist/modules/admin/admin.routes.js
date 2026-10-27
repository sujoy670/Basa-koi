"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
// Strict RBAC: Must be authenticated and have 'admin' role
router.use(auth_1.requireAuth, (0, auth_1.requireRole)(['admin']));
router.get('/overview', admin_controller_1.AdminController.getOverview);
router.post('/properties/:id/approve', admin_controller_1.AdminController.approve);
router.post('/properties/:id/reject', admin_controller_1.AdminController.reject);
router.post('/users/:userId/verify-owner', admin_controller_1.AdminController.verifyOwner);
exports.default = router;
