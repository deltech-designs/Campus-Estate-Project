import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import type { PropertyType } from '@ems/shared';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @IsEnum(['apartment', 'duplex', 'commercial', 'land'], { message: 'Invalid property type' })
  type!: PropertyType;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address!: string;

  @IsNumber({}, { message: 'Rent amount must be a number' })
  @Min(0, { message: 'Rent amount must be non-negative' })
  rentAmount!: number;

  @IsNumber({}, { message: 'Bedrooms must be a number' })
  @Min(1, { message: 'Bedrooms must be at least 1' })
  bedrooms!: number;

  @IsString()
  @IsNotEmpty({ message: 'Estate zone is required' })
  estateZone!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsOptional()
  landlordId?: string;
}
