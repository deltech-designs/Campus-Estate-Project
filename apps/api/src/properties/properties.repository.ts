import { PropertyModel, Property } from './properties.model';
import type { DocumentType } from '@typegoose/typegoose';

export class PropertyRepository {
  async findAll(filter: Record<string, unknown> = {}): Promise<DocumentType<Property>[]> {
    return PropertyModel.find({ ...filter, isDeleted: false }).lean();
  }

  async findById(id: string): Promise<DocumentType<Property> | null> {
    return PropertyModel.findOne({ _id: id, isDeleted: false }).lean();
  }

  async create(data: Partial<Property>): Promise<DocumentType<Property>> {
    return PropertyModel.create(data);
  }

  async update(id: string, data: Partial<Property>): Promise<DocumentType<Property> | null> {
    return PropertyModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  }

  async softDelete(id: string): Promise<void> {
    await PropertyModel.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  }
}
