import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, Min, Max } from 'class-validator';
import type { VendorSpecialty, VendorStatus } from '@ems/shared';

export class UpdateVendorDto {
  @IsString() @IsOptional() name?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() phone?: string;
  @IsEnum(['plumbing','electrical','carpentry','painting','cleaning','security','landscaping','general']) @IsOptional() specialty?: VendorSpecialty;
  @IsEnum(['active','inactive','suspended']) @IsOptional() status?: VendorStatus;
  @IsString() @IsOptional() address?: string;
  @IsNumber() @Min(0) @Max(5) @IsOptional() rating?: number;
}
