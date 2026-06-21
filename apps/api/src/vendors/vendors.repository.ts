import { VendorModel, Vendor } from './vendors.model';
import type { DocumentType } from '@typegoose/typegoose';

export class VendorRepository {
  async findAll(): Promise<DocumentType<Vendor>[]> { return VendorModel.find({ isDeleted: false }).lean(); }
  async findById(id: string): Promise<DocumentType<Vendor> | null> { return VendorModel.findOne({ _id: id, isDeleted: false }).lean(); }
  async create(data: Partial<Vendor>): Promise<DocumentType<Vendor>> { return VendorModel.create(data); }
  async update(id: string, data: Partial<Vendor>): Promise<DocumentType<Vendor> | null> { return VendorModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean(); }
  async softDelete(id: string): Promise<void> { await VendorModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }); }
}
