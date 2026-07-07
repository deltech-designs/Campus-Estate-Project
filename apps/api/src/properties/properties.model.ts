import { prop, modelOptions, Severity, getModelForClass, Ref } from '@typegoose/typegoose';
import type { PropertyType, PropertyStatus } from '@ems/shared';

@modelOptions({
  schemaOptions: { collection: 'properties', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Property {
  @prop({ required: true, trim: true })
  title!: string;

  @prop({ required: true, type: () => String, enum: ['apartment', 'duplex', 'commercial', 'land'] })
  type!: PropertyType;

  @prop({
    required: true,
    type: () => String,
    enum: ['available', 'occupied', 'maintenance', 'inactive'],
    default: 'available',
  })
  status!: PropertyStatus;

  @prop({ required: true })
  address!: string;

  @prop({ required: true, min: 0 })
  rentAmount!: number;

  @prop({ required: true, min: 1 })
  bedrooms!: number;

  @prop({ required: true })
  estateZone!: string;

  @prop({ type: () => [String], default: [] })
  amenities!: string[];

  @prop({ ref: () => 'User' })
  landlordId?: Ref<any>;

  @prop({ default: false })
  isDeleted!: boolean;
}

export const PropertyModel = getModelForClass(Property);
