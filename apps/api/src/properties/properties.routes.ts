import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import * as ctrl from './properties.controller';

const router = Router();

router.get('/', authenticate, asyncWrapper(ctrl.getAllProperties));
router.get('/:id', authenticate, asyncWrapper(ctrl.getPropertyById));
router.post('/', authenticate, requireRole('admin', 'manager'), validateDto(CreatePropertyDto), asyncWrapper(ctrl.createProperty));
router.patch('/:id', authenticate, requireRole('admin', 'manager'), validateDto(UpdatePropertyDto), asyncWrapper(ctrl.updateProperty));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deleteProperty));

export default router;
