import { Request, Response } from 'express';
import { PaymentService } from './payments.service';
import { sendSuccess } from '../shared/utils/response';

const service = new PaymentService();
export const getAllPayments = async (_req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.getAll(), 'Payments fetched'); };
export const getPaymentById = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.getById(req.params['id'] as string), 'Payment fetched'); };
export const createPayment = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.create(req.body), 'Payment created', 201); };
export const updatePayment = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.update(req.params['id'] as string, req.body), 'Payment updated'); };
export const deletePayment = async (req: Request, res: Response): Promise<void> => { await service.delete(req.params['id'] as string); sendSuccess(res, null, 'Payment deleted'); };
