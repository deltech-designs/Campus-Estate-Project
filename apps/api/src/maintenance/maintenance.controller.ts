import { Response } from 'express';
import { AuthRequest } from '../shared/middleware/authenticate';
import { MaintenanceService } from './maintenance.service';
import { sendSuccess } from '../shared/utils/response';

const service = new MaintenanceService();

export const getAllMaintenance = async (req: AuthRequest, res: Response): Promise<void> => {
  const role = req.user?.role;
  const userId = req.user?.id;
  const data = await service.getAll(role, userId);
  sendSuccess(res, data, 'Maintenance requests fetched');
};
export const getMaintenanceById = async (req: AuthRequest, res: Response): Promise<void> => { const data = await service.getById(req.params['id'] as string); sendSuccess(res, data, 'Maintenance request fetched'); };
export const createMaintenance = async (req: AuthRequest, res: Response): Promise<void> => { const data = await service.create(req.body); sendSuccess(res, data, 'Maintenance request created', 201); };
export const updateMaintenance = async (req: AuthRequest, res: Response): Promise<void> => { const data = await service.update(req.params['id'] as string, req.body); sendSuccess(res, data, 'Maintenance request updated'); };
export const deleteMaintenance = async (req: AuthRequest, res: Response): Promise<void> => { await service.delete(req.params['id'] as string); sendSuccess(res, null, 'Maintenance request deleted'); };
