import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import type { MaintenancePriority } from '@ems/shared';

export class CreateMaintenanceDto {
  @IsString() @IsNotEmpty() propertyId!: string;
  @IsString() @IsOptional() tenantId?: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() description!: string;
  @IsEnum(['low', 'medium', 'high', 'urgent']) priority!: MaintenancePriority;
  @IsString() @IsOptional() vendorId?: string;
  @IsDateString() @IsOptional() scheduledDate?: string;
}
