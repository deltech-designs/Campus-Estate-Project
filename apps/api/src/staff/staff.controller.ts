import { Request, Response } from 'express';
import { StaffService } from './staff.service';
import { sendSuccess } from '../shared/utils/response';

const service = new StaffService();
export const getAllStaff = async (_req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.getAll(), 'Staff fetched'); };
export const getStaffById = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.getById(req.params['id'] as string), 'Staff member fetched'); };
export const createStaff = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.create(req.body), 'Staff member created', 201); };
export const updateStaff = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.update(req.params['id'] as string, req.body), 'Staff member updated'); };
export const deleteStaff = async (req: Request, res: Response): Promise<void> => { await service.delete(req.params['id'] as string); sendSuccess(res, null, 'Staff member deleted'); };
