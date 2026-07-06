import { PropertyRepository } from './properties.repository';
import { CreatePropertyDto } from './dtos/create-property.dto';
import { UpdatePropertyDto } from './dtos/update-property.dto';
import type { DocumentType } from '@typegoose/typegoose';
import type { Property } from './properties.model';

export class PropertyService {
  private repo = new PropertyRepository();

  async getAllProperties(role?: string, userId?: string): Promise<DocumentType<Property>[]> {
    const filter = role === 'manager' ? { landlordId: userId } : {};
    return this.repo.findAll(filter);
  }

  async getPropertyById(id: string): Promise<DocumentType<Property>> {
    const property = await this.repo.findById(id);
    if (!property) {
      throw { status: 404, message: 'Property not found', code: 'NOT_FOUND' };
    }
    return property;
  }

  async createProperty(dto: CreatePropertyDto): Promise<DocumentType<Property>> {
    return this.repo.create(dto);
  }

  async updateProperty(id: string, dto: UpdatePropertyDto): Promise<DocumentType<Property>> {
    await this.getPropertyById(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) {
      throw { status: 500, message: 'Update failed', code: 'UPDATE_FAILED' };
    }
    return updated;
  }

  async deleteProperty(id: string): Promise<void> {
    await this.getPropertyById(id);
    await this.repo.softDelete(id);
  }
}
