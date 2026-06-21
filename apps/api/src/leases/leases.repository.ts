import { LeaseModel, Lease } from './leases.model';
import type { DocumentType } from '@typegoose/typegoose';

export class LeaseRepository {
  async findAll(): Promise<DocumentType<Lease>[]> {
    return LeaseModel.find({ isDeleted: false }).lean();
  }

  async findById(id: string): Promise<DocumentType<Lease> | null> {
    return LeaseModel.findOne({ _id: id, isDeleted: false }).lean();
  }

  async findByTenant(tenantId: string): Promise<DocumentType<Lease>[]> {
    return LeaseModel.find({ tenantId, isDeleted: false }).lean();
  }

  async create(data: Partial<Lease>): Promise<DocumentType<Lease>> {
    return LeaseModel.create(data);
  }

  async update(id: string, data: Partial<Lease>): Promise<DocumentType<Lease> | null> {
    return LeaseModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async softDelete(id: string): Promise<void> {
    await LeaseModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  }
}
