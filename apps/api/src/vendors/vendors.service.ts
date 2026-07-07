import { VendorRepository } from './vendors.repository';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { UpdateVendorDto } from './dtos/update-vendor.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Vendor } from './vendors.model';

export class VendorService {
  private repo = new VendorRepository();
  async getAll(): Promise<DocumentType<Vendor>[]> { return this.repo.findAll(); }
  async getById(id: string): Promise<DocumentType<Vendor>> {
    const v = await this.repo.findById(id);
    if (!v) throw { status: 404, message: 'Vendor not found', code: 'NOT_FOUND' };
    return v;
  }
  async create(dto: CreateVendorDto): Promise<DocumentType<Vendor>> { return this.repo.create(dto); }
  async update(id: string, dto: UpdateVendorDto): Promise<DocumentType<Vendor>> {
    await this.getById(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    return updated;
  }
  async delete(id: string): Promise<void> { await this.getById(id); await this.repo.softDelete(id); }
}
