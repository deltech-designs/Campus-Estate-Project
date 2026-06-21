import { Request, Response } from 'express';
import { MaintenanceService } from './maintenance.service';
import { sendSuccess } from '../shared/utils/response';

const service = new MaintenanceService();

export const getAllMaintenance = async (_req: Request, res: Response): Promise<void> => { const data = await service.getAll(); sendSuccess(res, data, 'Maintenance requests fetched'); };
export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => { const data = await service.getById(req.params['id'] as string); sendSuccess(res, data, 'Maintenance request fetched'); };
export const createMaintenance = async (req: Request, res: Response): Promise<void> => { const data = await service.create(req.body); sendSuccess(res, data, 'Maintenance request created', 201); };
export const updateMaintenance = async (req: Request, res: Response): Promise<void> => { const data = await service.update(req.params['id'] as string, req.body); sendSuccess(res, data, 'Maintenance request updated'); };
export const deleteMaintenance = async (req: Request, res: Response): Promise<void> => { await service.delete(req.params['id'] as string); sendSuccess(res, null, 'Maintenance request deleted'); };
