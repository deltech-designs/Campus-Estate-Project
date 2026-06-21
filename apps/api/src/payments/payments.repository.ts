import { PaymentModel, Payment } from './payments.model';
import type { DocumentType } from '@typegoose/typegoose';

export class PaymentRepository {
  async findAll(): Promise<DocumentType<Payment>[]> { return PaymentModel.find({ isDeleted: false }).lean(); }
  async findById(id: string): Promise<DocumentType<Payment> | null> { return PaymentModel.findOne({ _id: id, isDeleted: false }).lean(); }
  async findByTenant(tenantId: string): Promise<DocumentType<Payment>[]> { return PaymentModel.find({ tenantId, isDeleted: false }).lean(); }
  async create(data: Partial<Payment>): Promise<DocumentType<Payment>> { return PaymentModel.create(data); }
  async update(id: string, data: Partial<Payment>): Promise<DocumentType<Payment> | null> { return PaymentModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean(); }
  async softDelete(id: string): Promise<void> { await PaymentModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }); }
}
