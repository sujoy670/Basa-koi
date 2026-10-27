import { Router } from 'express';
import { PropertyController } from './property.controller';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createPropertySchema, updatePropertySchema } from './property.schema';

const router = Router();

router.get('/', PropertyController.list);
router.get('/:id', PropertyController.getById);
router.post('/', requireAuth, validate(createPropertySchema), PropertyController.create);
router.put('/:id', requireAuth, validate(updatePropertySchema), PropertyController.update);
router.delete('/:id', requireAuth, PropertyController.delete);

export default router;

