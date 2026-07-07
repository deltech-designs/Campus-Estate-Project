import { TenantModel, Tenant } from './tenants.model';
import type { DocumentType } from '@typegoose/typegoose';

export class TenantRepository {
  async findAll(): Promise<DocumentType<Tenant>[]> {
    return TenantModel.find({ isDeleted: false });
  }

  async findById(id: string): Promise<DocumentType<Tenant> | null> {
    return TenantModel.findOne({ _id: id, isDeleted: false });
  }

  async findByEmail(email: string): Promise<DocumentType<Tenant> | null> {
    return TenantModel.findOne({ email, isDeleted: false });
  }

  async create(data: Partial<Tenant>): Promise<DocumentType<Tenant>> {
    return TenantModel.create(data);
  }

  async update(id: string, data: Partial<Tenant>): Promise<DocumentType<Tenant> | null> {
    return TenantModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async softDelete(id: string): Promise<void> {
    await TenantModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  }
}
