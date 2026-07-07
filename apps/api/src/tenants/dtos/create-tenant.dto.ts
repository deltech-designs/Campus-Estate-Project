import { IsString, IsNotEmpty, IsEmail, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  relationship!: string;
}

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  nin!: string;

  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact!: EmergencyContactDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents?: string[];
}
