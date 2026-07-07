import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import type { VendorSpecialty } from '@ems/shared';

export class CreateVendorDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() phone!: string;
  @IsEnum(['plumbing','electrical','carpentry','painting','cleaning','security','landscaping','general']) specialty!: VendorSpecialty;
  @IsString() @IsOptional() address?: string;
}
