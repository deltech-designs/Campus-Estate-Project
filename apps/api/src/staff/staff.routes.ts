import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { UpdateStaffDto } from './dtos/update-staff.dto';
import * as ctrl from './staff.controller';

const router: Router = Router();
router.get('/', authenticate, asyncWrapper(ctrl.getAllStaff));
router.get('/:id', authenticate, asyncWrapper(ctrl.getStaffById));
router.post('/', authenticate, requireRole('admin'), validateDto(CreateStaffDto), asyncWrapper(ctrl.createStaff));
router.patch('/:id', authenticate, requireRole('admin'), validateDto(UpdateStaffDto), asyncWrapper(ctrl.updateStaff));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deleteStaff));
export default router;
