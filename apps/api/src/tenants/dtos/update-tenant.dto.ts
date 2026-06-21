import { IsString, IsEmail, IsArray, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { TenantStatus } from '@ems/shared';

class UpdateEmergencyContactDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() relationship?: string;
}

export class UpdateTenantDto {
  @IsString() @IsOptional() firstName?: string;
  @IsString() @IsOptional() lastName?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() phone?: string;
  @IsString() @IsOptional() nin?: string;
  @IsEnum(['active', 'inactive', 'blacklisted']) @IsOptional() status?: TenantStatus;
  @ValidateNested() @Type(() => UpdateEmergencyContactDto) @IsOptional() emergencyContact?: UpdateEmergencyContactDto;
  @IsArray() @IsString({ each: true }) @IsOptional() documents?: string[];
}
