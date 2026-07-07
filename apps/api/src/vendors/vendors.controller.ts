import { Request, Response } from 'express';
import { VendorService } from './vendors.service';
import { sendSuccess } from '../shared/utils/response';

const service = new VendorService();
export const getAllVendors = async (_req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.getAll(), 'Vendors fetched'); };
export const getVendorById = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.getById(req.params['id'] as string), 'Vendor fetched'); };
export const createVendor = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.create(req.body), 'Vendor created', 201); };
export const updateVendor = async (req: Request, res: Response): Promise<void> => { sendSuccess(res, await service.update(req.params['id'] as string, req.body), 'Vendor updated'); };
export const deleteVendor = async (req: Request, res: Response): Promise<void> => { await service.delete(req.params['id'] as string); sendSuccess(res, null, 'Vendor deleted'); };
