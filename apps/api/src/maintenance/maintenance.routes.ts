import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreateMaintenanceDto } from './dtos/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dtos/update-maintenance.dto';
import * as ctrl from './maintenance.controller';

const router = Router();

router.get('/', authenticate, asyncWrapper(ctrl.getAllMaintenance));
router.get('/:id', authenticate, asyncWrapper(ctrl.getMaintenanceById));
router.post('/', authenticate, validateDto(CreateMaintenanceDto), asyncWrapper(ctrl.createMaintenance));
router.patch('/:id', authenticate, requireRole('admin', 'manager'), validateDto(UpdateMaintenanceDto), asyncWrapper(ctrl.updateMaintenance));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deleteMaintenance));

export default router;
