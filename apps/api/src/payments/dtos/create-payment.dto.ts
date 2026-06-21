import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsEnum, IsOptional } from 'class-validator';
import type { PaymentMethod } from '@ems/shared';

export class CreatePaymentDto {
  @IsString() @IsNotEmpty() leaseId!: string;
  @IsString() @IsNotEmpty() tenantId!: string;
  @IsString() @IsNotEmpty() propertyId!: string;
  @IsNumber() @Min(0) amount!: number;
  @IsDateString() dueDate!: string;
  @IsEnum(['bank_transfer','card','cash','ussd']) @IsOptional() method?: PaymentMethod;
}
