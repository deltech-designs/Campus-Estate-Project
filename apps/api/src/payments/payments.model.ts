import { prop, modelOptions, Severity, getModelForClass, Ref } from '@typegoose/typegoose';
import type { PaymentStatus, PaymentMethod } from '@ems/shared';
import { Lease } from '../leases/leases.model';
import { Tenant } from '../tenants/tenants.model';
import { Property } from '../properties/properties.model';

@modelOptions({
  schemaOptions: { collection: 'payments', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Payment {
  @prop({ required: true, ref: () => Lease }) leaseId!: Ref<Lease>;
  @prop({ required: true, ref: () => Tenant }) tenantId!: Ref<Tenant>;
  @prop({ required: true, ref: () => Property }) propertyId!: Ref<Property>;
  @prop({ required: true, min: 0 }) amount!: number;
  @prop({ required: true }) dueDate!: Date;
  @prop() paidDate?: Date;
  @prop({ required: true, type: () => String, enum: ['pending','paid','partial','overdue'], default: 'pending' }) status!: PaymentStatus;
  @prop({ type: () => String, enum: ['bank_transfer','card','cash','ussd'] }) method?: PaymentMethod;
  @prop() receiptUrl?: string;
  @prop({ default: false }) isDeleted!: boolean;
}

export const PaymentModel = getModelForClass(Payment);
