import { prop, modelOptions, Severity, getModelForClass } from '@typegoose/typegoose';
import type { UserRole } from '@ems/shared';

@modelOptions({
  schemaOptions: { collection: 'users', timestamps: true },
  options: { allowMixed: Severity.ERROR },
})
export class User {
  @prop({ required: true, trim: true })
  firstName!: string;

  @prop({ required: true, trim: true })
  lastName!: string;

  @prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true, type: () => String, enum: ['admin', 'manager', 'tenant'], default: 'tenant' })
  role!: UserRole;

  @prop({ trim: true })
  phone?: string;

  @prop({ default: true })
  isActive!: boolean;

  @prop({ default: false })
  isDeleted!: boolean;
}

export const UserModel = getModelForClass(User);
