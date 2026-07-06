import { MaintenanceRepository } from './maintenance.repository';
import { CreateMaintenanceDto } from './dtos/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dtos/update-maintenance.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { MaintenanceRequest } from './maintenance.model';
import { PropertyRepository } from '../properties/properties.repository';
import { UserModel } from '../auth/auth.model';
import { TenantModel } from '../tenants/tenants.model';

export class MaintenanceService {
  private repo = new MaintenanceRepository();
  private propertyRepo = new PropertyRepository();

  async getAll(role?: string, userId?: string): Promise<DocumentType<MaintenanceRequest>[]> {
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

  async getById(id: string): Promise<DocumentType<MaintenanceRequest>> {
    const item = await this.repo.findById(id);
    if (!item) throw { status: 404, message: 'Maintenance request not found', code: 'NOT_FOUND' };
    return item;
  }

  async create(dto: CreateMaintenanceDto): Promise<DocumentType<MaintenanceRequest>> {
    return this.repo.create(dto as unknown as Partial<MaintenanceRequest>);
  }

  async update(id: string, dto: UpdateMaintenanceDto): Promise<DocumentType<MaintenanceRequest>> {
    await this.getById(id);
    const updated = await this.repo.update(id, dto as unknown as Partial<MaintenanceRequest>);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repo.softDelete(id);
  }
}
