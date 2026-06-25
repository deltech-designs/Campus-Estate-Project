import { prop, modelOptions, Severity, getModelForClass, Ref } from '@typegoose/typegoose';
import type { LeaseStatus } from '@ems/shared';
import { Property } from '../properties/properties.model';
import { Tenant } from '../tenants/tenants.model';

@modelOptions({
  schemaOptions: { collection: 'leases', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Lease {
  @prop({ required: true, ref: () => Property })
  propertyId!: Ref<Property>;

  @prop({ required: true, ref: () => Tenant })
  tenantId!: Ref<Tenant>;

  @prop({ required: true })
  startDate!: Date;

  @prop({ required: true })
  endDate!: Date;

  @prop({ required: true, min: 0 })
  monthlyRent!: number;

  @prop({ required: true, min: 0 })
  securityDeposit!: number;

  @prop({ required: true, type: () => String, enum: ['active', 'expired', 'terminated', 'renewed'], default: 'active' })
  status!: LeaseStatus;

  @prop({ default: false })
  renewalNotified!: boolean;

  @prop({ default: false })
  isDeleted!: boolean;
}

export const LeaseModel = getModelForClass(Lease);
