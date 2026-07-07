import { IsNumber, Min, IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';
import type { PaymentStatus, PaymentMethod } from '@ems/shared';

export class UpdatePaymentDto {
  @IsNumber() @Min(0) @IsOptional() amount?: number;
  @IsDateString() @IsOptional() dueDate?: string;
  @IsDateString() @IsOptional() paidDate?: string;
  @IsEnum(['pending','paid','partial','overdue']) @IsOptional() status?: PaymentStatus;
  @IsEnum(['bank_transfer','card','cash','ussd']) @IsOptional() method?: PaymentMethod;
  @IsString() @IsOptional() receiptUrl?: string;
}
