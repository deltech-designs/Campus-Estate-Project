import { StaffModel, Staff } from './staff.model';
import type { DocumentType } from '@typegoose/typegoose';

export class StaffRepository {
  async findAll(): Promise<DocumentType<Staff>[]> { return StaffModel.find({ isDeleted: false }); }
  async findById(id: string): Promise<DocumentType<Staff> | null> { return StaffModel.findOne({ _id: id, isDeleted: false }); }
  async create(data: Partial<Staff>): Promise<DocumentType<Staff>> { return StaffModel.create(data); }
  async update(id: string, data: Partial<Staff>): Promise<DocumentType<Staff> | null> { return StaffModel.findByIdAndUpdate(id, { $set: data }, { new: true }); }
  async softDelete(id: string): Promise<void> { await StaffModel.findByIdAndUpdate(id, { $set: { isDeleted: true } }); }
}
