import { Controller, Get, Query } from '@nestjs/common'
import { AdminService } from './admin.service'
import { BookingStatus } from '@prisma/client'

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('bookings')
  async getBookings(
    @Query('status') status?: BookingStatus,
    @Query('date') date?: string,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.adminService.getBookings({
      status,
      date,
      vehicleId,
    })
  }
}