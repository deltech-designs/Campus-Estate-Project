import { IsString, IsEnum, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import type { MaintenancePriority, MaintenanceStatus } from '@ems/shared';

export class UpdateMaintenanceDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsEnum(['low', 'medium', 'high', 'urgent']) @IsOptional() priority?: MaintenancePriority;
  @IsEnum(['open', 'assigned', 'in_progress', 'completed', 'closed']) @IsOptional() status?: MaintenanceStatus;
  @IsString() @IsOptional() vendorId?: string;
  @IsDateString() @IsOptional() scheduledDate?: string;
  @IsDateString() @IsOptional() completedDate?: string;
  @IsNumber() @Min(0) @IsOptional() cost?: number;
}
