import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import * as ctrl from './tenants.controller';

const router: Router = Router();

router.get('/', authenticate, asyncWrapper(ctrl.getAllTenants));
router.get('/:id', authenticate, asyncWrapper(ctrl.getTenantById));
router.post('/', authenticate, requireRole('admin', 'manager'), validateDto(CreateTenantDto), asyncWrapper(ctrl.createTenant));
router.patch('/:id', authenticate, requireRole('admin', 'manager'), validateDto(UpdateTenantDto), asyncWrapper(ctrl.updateTenant));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deleteTenant));

export default router;
