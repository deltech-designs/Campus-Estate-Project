import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsDateString } from 'class-validator';
import type { StaffRole } from '@ems/shared';

export class CreateStaffDto {
  @IsString() @IsNotEmpty() firstName!: string;
  @IsString() @IsNotEmpty() lastName!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() phone!: string;
  @IsEnum(['security','cleaner','facility_manager','maintenance_supervisor']) role!: StaffRole;
  @IsString() @IsOptional() estateZone?: string;
  @IsDateString() hireDate!: string;
}
