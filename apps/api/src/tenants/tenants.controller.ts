import { Request, Response } from 'express';
import { TenantService } from './tenants.service';
import { sendSuccess } from '../shared/utils/response';

const service = new TenantService();

export const getAllTenants = async (_req: Request, res: Response): Promise<void> => {
  const data = await service.getAllTenants();
  sendSuccess(res, data, 'Tenants fetched');
};

export const getTenantById = async (req: Request, res: Response): Promise<void> => {
  const data = await service.getTenantById(req.params['id'] as string);
  sendSuccess(res, data, 'Tenant fetched');
};

export const createTenant = async (req: Request, res: Response): Promise<void> => {
  const data = await service.createTenant(req.body);
  sendSuccess(res, data, 'Tenant created', 201);
};

export const updateTenant = async (req: Request, res: Response): Promise<void> => {
  const data = await service.updateTenant(req.params['id'] as string, req.body);
  sendSuccess(res, data, 'Tenant updated');
};

export const deleteTenant = async (req: Request, res: Response): Promise<void> => {
  await service.deleteTenant(req.params['id'] as string);
  sendSuccess(res, null, 'Tenant deleted');
};
