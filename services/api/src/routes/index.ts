import { Router } from 'express';
import propertyRoutes from '../modules/properties/property.routes';
import messagingRoutes from '../modules/messaging/messaging.routes';
import adminRoutes from '../modules/admin/admin.routes';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Basa-koi (HomeFinder BD) REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/chats', messagingRoutes);
router.use('/admin', adminRoutes);

export default router;

