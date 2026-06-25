import { prop, modelOptions, Severity, getModelForClass } from '@typegoose/typegoose';
import type { VendorStatus, VendorSpecialty } from '@ems/shared';

@modelOptions({
  schemaOptions: { collection: 'vendors', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Vendor {
  @prop({ required: true, trim: true }) name!: string;
  @prop({ required: true, unique: true, lowercase: true, trim: true }) email!: string;
  @prop({ required: true }) phone!: string;
  @prop({ required: true, type: () => String, enum: ['plumbing','electrical','carpentry','painting','cleaning','security','landscaping','general'] }) specialty!: VendorSpecialty;
  @prop({ required: true, type: () => String, enum: ['active','inactive','suspended'], default: 'active' }) status!: VendorStatus;
  @prop() address?: string;
  @prop({ min: 0, max: 5 }) rating?: number;
  @prop({ default: false }) isDeleted!: boolean;
}

export const VendorModel = getModelForClass(Vendor);
