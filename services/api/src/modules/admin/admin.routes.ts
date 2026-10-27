import { Router } from 'express';
import { AdminController } from './admin.controller';
import { requireAuth, requireRole } from '../../middleware/auth';

const router = Router();

// Strict RBAC: Must be authenticated and have 'admin' role
router.use(requireAuth, requireRole(['admin']));

router.get('/overview', AdminController.getOverview);
router.post('/properties/:id/approve', AdminController.approve);
router.post('/properties/:id/reject', AdminController.reject);
router.post('/users/:userId/verify-owner', AdminController.verifyOwner);

export default router;

