import { LeaseRepository } from './leases.repository';
import { CreateLeaseDto } from './dtos/create-lease.dto';
import { UpdateLeaseDto } from './dtos/update-lease.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Lease } from './leases.model';

export class LeaseService {
  private repo = new LeaseRepository();

  async getAllLeases(): Promise<DocumentType<Lease>[]> { return this.repo.findAll(); }

  async getLeaseById(id: string): Promise<DocumentType<Lease>> {
    const lease = await this.repo.findById(id);
    if (!lease) throw { status: 404, message: 'Lease not found', code: 'NOT_FOUND' };
    return lease;
  }

  async createLease(dto: CreateLeaseDto): Promise<DocumentType<Lease>> {
    return this.repo.create(dto as unknown as Partial<Lease>);
  }

  async updateLease(id: string, dto: UpdateLeaseDto): Promise<DocumentType<Lease>> {
    await this.getLeaseById(id);
    const updated = await this.repo.update(id, dto as unknown as Partial<Lease>);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }

  async deleteLease(id: string): Promise<void> {
    await this.getLeaseById(id);
    await this.repo.softDelete(id);
  }
}
