import { prop, modelOptions, Severity, getModelForClass } from '@typegoose/typegoose';
import type { StaffRole, StaffStatus } from '@ems/shared';

@modelOptions({
  schemaOptions: { collection: 'staff', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class Staff {
  @prop({ required: true, trim: true }) firstName!: string;
  @prop({ required: true, trim: true }) lastName!: string;
  @prop({ required: true, unique: true, lowercase: true }) email!: string;
  @prop({ required: true }) phone!: string;
  @prop({ required: true, type: () => String, enum: ['security','cleaner','facility_manager','maintenance_supervisor'] }) role!: StaffRole;
  @prop({ required: true, type: () => String, enum: ['active','on_leave','terminated'], default: 'active' }) status!: StaffStatus;
  @prop() estateZone?: string;
  @prop({ required: true }) hireDate!: Date;
  @prop({ default: false }) isDeleted!: boolean;
}

export const StaffModel = getModelForClass(Staff);
