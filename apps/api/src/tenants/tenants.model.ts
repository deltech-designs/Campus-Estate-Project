import { prop, modelOptions, Severity, getModelForClass } from '@typegoose/typegoose';
import type { TenantStatus } from '@ems/shared';

class EmergencyContact {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  phone!: string;

  @prop({ required: true })
  relationship!: string;
}

@modelOptions({
  schemaOptions: { collection: 'tenants', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Tenant {
  @prop({ required: true, trim: true })
  firstName!: string;

  @prop({ required: true, trim: true })
  lastName!: string;

  @prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @prop({ required: true })
  phone!: string;

  @prop({ required: true })
  nin!: string;

  @prop({ required: true, enum: ['active', 'inactive', 'blacklisted'], default: 'active' })
  status!: TenantStatus;

  @prop({ required: true, _id: false, type: () => EmergencyContact })
  emergencyContact!: EmergencyContact;

  @prop({ type: () => [String], default: [] })
  documents!: string[];

  @prop({ default: false })
  isDeleted!: boolean;
}

export const TenantModel = getModelForClass(Tenant);
