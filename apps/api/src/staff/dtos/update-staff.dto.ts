import { IsString, IsEmail, IsEnum, IsOptional, IsDateString } from 'class-validator';
import type { StaffRole, StaffStatus } from '@ems/shared';

export class UpdateStaffDto {
  @IsString() @IsOptional() firstName?: string;
  @IsString() @IsOptional() lastName?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() phone?: string;
  @IsEnum(['security','cleaner','facility_manager','maintenance_supervisor']) @IsOptional() role?: StaffRole;
  @IsEnum(['active','on_leave','terminated']) @IsOptional() status?: StaffStatus;
  @IsString() @IsOptional() estateZone?: string;
  @IsDateString() @IsOptional() hireDate?: string;
}
