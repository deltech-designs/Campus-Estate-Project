import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './dtos/create-staff.dto';
import { UpdateStaffDto } from './dtos/update-staff.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Staff } from './staff.model';

export class StaffService {
  private repo = new StaffRepository();
  async getAll(): Promise<DocumentType<Staff>[]> { return this.repo.findAll(); }
  async getById(id: string): Promise<DocumentType<Staff>> {
    const s = await this.repo.findById(id);
    if (!s) throw { status: 404, message: 'Staff not found', code: 'NOT_FOUND' };
    return s;
  }
  async create(dto: CreateStaffDto): Promise<DocumentType<Staff>> { return this.repo.create(dto); }
  async update(id: string, dto: UpdateStaffDto): Promise<DocumentType<Staff>> {
    await this.getById(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }
  async delete(id: string): Promise<void> { await this.getById(id); await this.repo.softDelete(id); }
}
