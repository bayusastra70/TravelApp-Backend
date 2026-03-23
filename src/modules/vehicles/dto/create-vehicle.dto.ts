// src/modules/vehicles/dto/create-vehicle.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator'

export class CreateVehicleDto {
  @IsString()
  tenantId: string

  @IsString()
  name: string

  @IsString()
  type: string

  @IsString()
  plateNumber: string

  @IsNumber()
  capacity: number

  @IsNumber()
  price: number

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}