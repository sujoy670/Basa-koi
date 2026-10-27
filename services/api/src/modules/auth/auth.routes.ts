import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/sync-profile', requireAuth, AuthController.syncProfile);
router.post('/fcm-token', requireAuth, AuthController.registerFcmToken);
router.delete('/fcm-token', requireAuth, AuthController.unregisterFcmToken);

export default router;

