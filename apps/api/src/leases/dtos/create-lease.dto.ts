import { IsString, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';

export class CreateLeaseDto {
  @IsString() @IsNotEmpty() propertyId!: string;
  @IsString() @IsNotEmpty() tenantId!: string;
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
  @IsNumber() @Min(0) monthlyRent!: number;
  @IsNumber() @Min(0) securityDeposit!: number;
}
