import { LeaseRepository } from './leases.repository';
import { CreateLeaseDto } from './dtos/create-lease.dto';
import { UpdateLeaseDto } from './dtos/update-lease.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Lease } from './leases.model';
import { PropertyRepository } from '../properties/properties.repository';
import { UserModel } from '../auth/auth.model';
import { TenantModel } from '../tenants/tenants.model';

export class LeaseService {
  private repo = new LeaseRepository();
  private propertyRepo = new PropertyRepository();

  async getAllLeases(role?: string, userId?: string): Promise<DocumentType<Lease>[]> {
    if (role === 'tenant') {
      const user = await UserModel.findById(userId);
      if (!user) return [];
      const tenant = await TenantModel.findOne({ email: user.email, isDeleted: false });
      if (!tenant) return [];
      return this.repo.findAll({ tenantId: tenant._id });
    }
    if (role === 'manager') {
      const properties = await this.propertyRepo.findAll({ landlordId: userId });
      const propertyIds = properties.map(p => p._id);
      return this.repo.findAll({ propertyId: { $in: propertyIds } });
    }
    return this.repo.findAll();
  }

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
