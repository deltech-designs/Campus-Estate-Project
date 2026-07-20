import { Response } from 'express';
import { AuthRequest } from '../shared/middleware/authenticate';
import { PaymentService } from './payments.service';
import { sendSuccess } from '../shared/utils/response';
import type { CreatePaymentDto } from './dtos/create-payment.dto';
import type { UpdatePaymentDto } from './dtos/update-payment.dto';

const service = new PaymentService();
export const getAllPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  const role = req.user?.role;
  const userId = req.user?.id;
  sendSuccess(res, await service.getAll(role, userId), 'Payments fetched');
};
export const getPaymentById = async (req: AuthRequest, res: Response): Promise<void> => { sendSuccess(res, await service.getById(req.params['id'] as string), 'Payment fetched'); };
export const createPayment = async (req: AuthRequest, res: Response): Promise<void> => { sendSuccess(res, await service.create(req.body as CreatePaymentDto), 'Payment created', 201); };
export const updatePayment = async (req: AuthRequest, res: Response): Promise<void> => { sendSuccess(res, await service.update(req.params['id'] as string, req.body as UpdatePaymentDto), 'Payment updated'); };
export const deletePayment = async (req: AuthRequest, res: Response): Promise<void> => { await service.delete(req.params['id'] as string); sendSuccess(res, null, 'Payment deleted'); };
