import { MaintenanceRepository } from './maintenance.repository';
import { CreateMaintenanceDto } from './dtos/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dtos/update-maintenance.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { MaintenanceRequest } from './maintenance.model';

export class MaintenanceService {
  private repo = new MaintenanceRepository();

  async getAll(): Promise<DocumentType<MaintenanceRequest>[]> { return this.repo.findAll(); }

  async getById(id: string): Promise<DocumentType<MaintenanceRequest>> {
    const item = await this.repo.findById(id);
    if (!item) throw { status: 404, message: 'Maintenance request not found', code: 'NOT_FOUND' };
    return item;
  }

  async create(dto: CreateMaintenanceDto): Promise<DocumentType<MaintenanceRequest>> {
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateMaintenanceDto): Promise<DocumentType<MaintenanceRequest>> {
    await this.getById(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repo.softDelete(id);
  }
}
