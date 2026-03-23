import { Controller, Get, Post, Body } from '@nestjs/common'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { Patch, Param, Query } from '@nestjs/common'
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto'

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto)
  }

  @Get()
  async findAll() {
    return this.bookingsService.findAll()
  }

  @Patch(':id/status')
  async updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateBookingStatusDto,
) {
  return this.bookingsService.updateStatus(
    id,
    dto.status,
    dto.changedBy,
  )
}

@Get('/schedule')
async schedule(@Query('date') date: string) {
  return this.bookingsService.getSchedule(date)
}

@Get('/admin/dashboard')
async dashboard() {
  return this.bookingsService.getDashboard()
}

@Get('calendar')
async calendar(
  @Query('start') start?: string,
  @Query('end') end?: string,
) {
  return this.bookingsService.getCalendar(start, end)
}

@Patch(':id/payment')
updatePayment(
  @Param('id') id: string,
  @Body('status') status: string
) {
  return this.bookingsService.updatePaymentStatus(id, status) // ✅ FIX
}
}
