import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreateLeaseDto } from './dtos/create-lease.dto';
import { UpdateLeaseDto } from './dtos/update-lease.dto';
import * as ctrl from './leases.controller';

const router = Router();

router.get('/', authenticate, asyncWrapper(ctrl.getAllLeases));
router.get('/:id', authenticate, asyncWrapper(ctrl.getLeaseById));
router.post('/', authenticate, requireRole('admin', 'manager'), validateDto(CreateLeaseDto), asyncWrapper(ctrl.createLease));
router.patch('/:id', authenticate, requireRole('admin', 'manager'), validateDto(UpdateLeaseDto), asyncWrapper(ctrl.updateLease));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deleteLease));

export default router;
