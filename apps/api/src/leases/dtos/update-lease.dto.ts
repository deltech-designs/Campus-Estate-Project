import { IsString, IsNumber, Min, IsDateString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import type { LeaseStatus } from '@ems/shared';

export class UpdateLeaseDto {
  @IsString() @IsOptional() propertyId?: string;
  @IsString() @IsOptional() tenantId?: string;
  @IsDateString() @IsOptional() startDate?: string;
  @IsDateString() @IsOptional() endDate?: string;
  @IsNumber() @Min(0) @IsOptional() monthlyRent?: number;
  @IsNumber() @Min(0) @IsOptional() securityDeposit?: number;
  @IsEnum(['active', 'expired', 'terminated', 'renewed']) @IsOptional() status?: LeaseStatus;
  @IsBoolean() @IsOptional() renewalNotified?: boolean;
}
