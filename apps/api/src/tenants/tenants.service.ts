import { TenantRepository } from './tenants.repository';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Tenant } from './tenants.model';

export class TenantService {
  private repo = new TenantRepository();

  async getAllTenants(): Promise<DocumentType<Tenant>[]> {
    return this.repo.findAll();
  }

  async getTenantById(id: string): Promise<DocumentType<Tenant>> {
    const tenant = await this.repo.findById(id);
    if (!tenant) throw { status: 404, message: 'Tenant not found', code: 'NOT_FOUND' };
    return tenant;
  }

  async createTenant(dto: CreateTenantDto): Promise<DocumentType<Tenant>> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw { status: 409, message: 'Email already in use', code: 'EMAIL_CONFLICT' };
    return this.repo.create(dto as unknown as Partial<Tenant>);
  }

  async updateTenant(id: string, dto: UpdateTenantDto): Promise<DocumentType<Tenant>> {
    await this.getTenantById(id);
    const updated = await this.repo.update(id, dto as unknown as Partial<Tenant>);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }

  async deleteTenant(id: string): Promise<void> {
    await this.getTenantById(id);
    await this.repo.softDelete(id);
  }
}
