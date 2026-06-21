import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { requireRole } from '../shared/middleware/requireRole';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import * as ctrl from './payments.controller';

const router: Router = Router();
router.get('/', authenticate, asyncWrapper(ctrl.getAllPayments));
router.get('/:id', authenticate, asyncWrapper(ctrl.getPaymentById));
router.post('/', authenticate, requireRole('admin', 'manager'), validateDto(CreatePaymentDto), asyncWrapper(ctrl.createPayment));
router.patch('/:id', authenticate, requireRole('admin', 'manager'), validateDto(UpdatePaymentDto), asyncWrapper(ctrl.updatePayment));
router.delete('/:id', authenticate, requireRole('admin'), asyncWrapper(ctrl.deletePayment));
export default router;
