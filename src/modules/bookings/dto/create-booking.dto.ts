import { IsString, IsDateString, IsOptional, IsEmail } from 'class-validator'

export class CreateBookingDto {
  
  @IsString()
  vehicleId: string

  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string

  @IsString()
  pickup: string

  @IsString()
  pickupTime: string

  @IsString()
  destination: string

  @IsString()
  guestName: string

  @IsString()
  guestPhone: string

  @IsEmail()
  @IsOptional()
  guestEmail?: string

  @IsString()
  @IsOptional()
  notes?: string
}