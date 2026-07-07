import { LeaseModel, Lease } from './leases.model';
import type { DocumentType } from '@typegoose/typegoose';

export class LeaseRepository {
  async findAll(filter: Record<string, unknown> = {}): Promise<DocumentType<Lease>[]> {
    return LeaseModel.find({ ...filter, isDeleted: false }).populate('propertyId').populate('tenantId');
  }

  async findById(id: string): Promise<DocumentType<Lease> | null> {
    return LeaseModel.findOne({ _id: id, isDeleted: false }).populate('propertyId').populate('tenantId');
  }

  async findByTenant(tenantId: string): Promise<DocumentType<Lease>[]> {
    return LeaseModel.find({ tenantId, isDeleted: false }).populate('propertyId').populate('tenantId');
  }

  async create(data: Partial<Lease>): Promise<DocumentType<Lease>> {
    return LeaseModel.create(data);
  }

  async update(id: string, data: Partial<Lease>): Promise<DocumentType<Lease> | null> {
    return LeaseModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async softDelete(id: string): Promise<void> {
    await LeaseModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  }
}
