import { MaintenanceModel, MaintenanceRequest } from './maintenance.model';
import type { DocumentType } from '@typegoose/typegoose';

export class MaintenanceRepository {
  async findAll(): Promise<DocumentType<MaintenanceRequest>[]> {
    return MaintenanceModel.find({ isDeleted: false });
  }

  async findById(id: string): Promise<DocumentType<MaintenanceRequest> | null> {
    return MaintenanceModel.findOne({ _id: id, isDeleted: false });
  }

  async create(data: Partial<MaintenanceRequest>): Promise<DocumentType<MaintenanceRequest>> {
    return MaintenanceModel.create(data);
  }

  async update(id: string, data: Partial<MaintenanceRequest>): Promise<DocumentType<MaintenanceRequest> | null> {
    return MaintenanceModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async softDelete(id: string): Promise<void> {
    await MaintenanceModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  }
}
