import { IsEnum, IsString } from 'class-validator'
import { BookingStatus } from '@prisma/client'

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus

  @IsString()
  changedBy: string
}