import { Request, Response } from 'express';
import { PropertyService } from './properties.service';
import { sendSuccess } from '../shared/utils/response';

const service = new PropertyService();

export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  const data = await service.getAllProperties();
  sendSuccess(res, data, 'Properties fetched');
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  const data = await service.getPropertyById(req.params['id'] as string);
  sendSuccess(res, data, 'Property fetched');
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  const data = await service.createProperty(req.body);
  sendSuccess(res, data, 'Property created', 201);
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  const data = await service.updateProperty(req.params['id'] as string, req.body);
  sendSuccess(res, data, 'Property updated');
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  await service.deleteProperty(req.params['id'] as string);
  sendSuccess(res, null, 'Property deleted');
};
