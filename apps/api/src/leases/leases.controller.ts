import { Request, Response } from 'express';
import { LeaseService } from './leases.service';
import { sendSuccess } from '../shared/utils/response';

const service = new LeaseService();

export const getAllLeases = async (_req: Request, res: Response): Promise<void> => { const data = await service.getAllLeases(); sendSuccess(res, data, 'Leases fetched'); };
export const getLeaseById = async (req: Request, res: Response): Promise<void> => { const data = await service.getLeaseById(req.params['id'] as string); sendSuccess(res, data, 'Lease fetched'); };
export const createLease = async (req: Request, res: Response): Promise<void> => { const data = await service.createLease(req.body); sendSuccess(res, data, 'Lease created', 201); };
export const updateLease = async (req: Request, res: Response): Promise<void> => { const data = await service.updateLease(req.params['id'] as string, req.body); sendSuccess(res, data, 'Lease updated'); };
export const deleteLease = async (req: Request, res: Response): Promise<void> => { await service.deleteLease(req.params['id'] as string); sendSuccess(res, null, 'Lease deleted'); };
