import {
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import type { PropertyType, PropertyStatus } from '@ems/shared';

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(['apartment', 'duplex', 'commercial', 'land'])
  @IsOptional()
  type?: PropertyType;

  @IsEnum(['available', 'occupied', 'maintenance', 'inactive'])
  @IsOptional()
  status?: PropertyStatus;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rentAmount?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  bedrooms?: number;

  @IsString()
  @IsOptional()
  estateZone?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];
}
