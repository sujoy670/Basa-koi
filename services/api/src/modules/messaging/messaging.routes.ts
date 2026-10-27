import { Router } from 'express';
import { MessagingController } from './messaging.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.post('/', requireAuth, MessagingController.getOrCreate);
router.post('/:chatId/messages', requireAuth, MessagingController.sendMessage);
router.patch('/:chatId/read', requireAuth, MessagingController.markRead);

export default router;

