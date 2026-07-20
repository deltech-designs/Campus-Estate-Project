import { Response } from 'express';
import { AuthRequest } from '../shared/middleware/authenticate';
import { PropertyService } from './properties.service';
import { sendSuccess } from '../shared/utils/response';
import type { CreatePropertyDto } from './dtos/create-property.dto';
import type { UpdatePropertyDto } from './dtos/update-property.dto';

const service = new PropertyService();

export const getAllProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  const role = req.user?.role;
  const userId = req.user?.id;
  const data = await service.getAllProperties(role, userId);
  sendSuccess(res, data, 'Properties fetched');
};

export const getPropertyById = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = await service.getPropertyById(req.params['id'] as string);
  sendSuccess(res, data, 'Property fetched');
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const payload = { ...(req.body as Record<string, unknown>) };
  if (req.user) {
    if (req.user.role === 'manager') {
      payload['landlordId'] = req.user.id;
    } else if (req.user.role === 'admin' && !(payload['landlordId'])) {
      payload['landlordId'] = req.user.id;
    }
  }
  const data = await service.createProperty(payload as unknown as CreatePropertyDto);
  sendSuccess(res, data, 'Property created', 201);
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  const data = await service.updateProperty(req.params['id'] as string, req.body as unknown as UpdatePropertyDto);
  sendSuccess(res, data, 'Property updated');
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  await service.deleteProperty(req.params['id'] as string);
  sendSuccess(res, null, 'Property deleted');
};
