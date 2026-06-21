import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UpdateVendorDto } from './dtos/update-vendor.dto';
import * as ctrl from './vendors.controller';

const router = Router();
router.get('/', authenticate, asyncWrapper(ctrl.getAllVendors));
router.get('/:id', authenticate, asyncWrapper(ctrl.getVendorById));
router.post('/', authenticate, requireRole('admin', 'manager'), validateDto(CreateVendorDto), asyncWrapper(ctrl.createVendor));
router.patch('/:id', authenticate, requireRole('admin', 'manager'), validateDto(UpdateVendorDto), asyncWrapper(ctrl.updateVendor));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deleteVendor));
export default router;
