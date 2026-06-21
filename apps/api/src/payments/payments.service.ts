import { PaymentRepository } from './payments.repository';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Payment } from './payments.model';

export class PaymentService {
  private repo = new PaymentRepository();
  async getAll(): Promise<DocumentType<Payment>[]> { return this.repo.findAll(); }
  async getById(id: string): Promise<DocumentType<Payment>> {
    const p = await this.repo.findById(id);
    if (!p) throw { status: 404, message: 'Payment not found', code: 'NOT_FOUND' };
    return p;
  }
  async create(dto: CreatePaymentDto): Promise<DocumentType<Payment>> { return this.repo.create(dto as unknown as Partial<Payment>); }
  async update(id: string, dto: UpdatePaymentDto): Promise<DocumentType<Payment>> {
    await this.getById(id);
    const updated = await this.repo.update(id, dto as unknown as Partial<Payment>);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }
  async delete(id: string): Promise<void> { await this.getById(id); await this.repo.softDelete(id); }
}
