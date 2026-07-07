import { prop, modelOptions, Severity, getModelForClass, Ref } from '@typegoose/typegoose';
import type { MaintenancePriority, MaintenanceStatus } from '@ems/shared';
import { Property } from '../properties/properties.model';
import { Tenant } from '../tenants/tenants.model';
import { Vendor } from '../vendors/vendors.model';

@modelOptions({
  schemaOptions: { collection: 'maintenance_requests', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class MaintenanceRequest {
  @prop({ required: true, ref: () => Property })
  propertyId!: Ref<Property>;

  @prop({ ref: () => Tenant })
  tenantId?: Ref<Tenant>;

  @prop({ required: true, trim: true })
  title!: string;

  @prop({ required: true })
  description!: string;

  @prop({ required: true, type: () => String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' })
  priority!: MaintenancePriority;

  @prop({ required: true, type: () => String, enum: ['open', 'assigned', 'in_progress', 'completed', 'closed'], default: 'open' })
  status!: MaintenanceStatus;

  @prop({ ref: () => Vendor })
  vendorId?: Ref<Vendor>;

  @prop()
  scheduledDate?: Date;

  @prop()
  completedDate?: Date;

  @prop({ min: 0 })
  cost?: number;

  @prop({ default: false })
  isDeleted!: boolean;
}

export const MaintenanceModel = getModelForClass(MaintenanceRequest);
