import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { Prisma, BookingStatus, PaymentStatus } from '@prisma/client'
import { CreateBookingDto } from './dto/create-booking.dto'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService, private notifications: NotificationsService) {}

  async create(dto: CreateBookingDto) {

  const tenantSlug = process.env.TENANT_SLUG

  const tenant = await this.prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  })

  if (!tenant) throw new BadRequestException('Tenant not found')

  const vehicle = await this.prisma.vehicle.findUnique({
    where: { id: dto.vehicleId },
  })

  if (!vehicle) throw new BadRequestException('Vehicle not found')

  const startDate = new Date(dto.startDate)
  const endDate = new Date(dto.endDate)

  if (endDate < startDate)
    throw new BadRequestException('End date must be after start date')

  const overlapping = await this.prisma.booking.findFirst({
    where: {
      vehicleId: dto.vehicleId,
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    },
  })

  if (overlapping)
    throw new BadRequestException(
      'This vehicle is already booked in the selected date range',
    )

  const dayCount =
    Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const totalPrice = new Prisma.Decimal(vehicle.price).mul(dayCount)

  const bookingCode = await this.generateBookingCode()

  return await this.prisma.$transaction(async (tx) => {

    const booking = await tx.booking.create({
      data: {
        bookingCode, 
        tenantId: tenant.id,
        vehicleId: dto.vehicleId,
        startDate,
        endDate,
        pickup: dto.pickup,
        destination: dto.destination,
        pickupTime: dto.pickupTime,
        guestName: dto.guestName,
        guestPhone: dto.guestPhone,
        guestEmail: dto.guestEmail,
        notes: dto.notes,
        status: BookingStatus.PENDING,
        totalPrice,
      },
    })

    await tx.bookingStatusLog.create({
      data: {
        bookingId: booking.id,
        oldStatus: BookingStatus.PENDING,
        newStatus: BookingStatus.PENDING,
        changedBy: 'SYSTEM',
      },
    })

    /* 🔔 CREATE NOTIFICATION */

  await tx.notification.create({
    data: {
      bookingId: booking.id,
      title: "Booking Received",
      message: `Your booking ${booking.bookingCode} is pending confirmation`
    }
  })

    return booking
  })
}

  private async generateBookingCode() {

  const today = new Date()

  const datePart =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')

  const count = await this.prisma.booking.count({
    where: {
      createdAt: {
        gte: new Date(today.setHours(0,0,0,0))
      }
    }
  })

  const sequence = String(count + 1).padStart(4, '0')

  return `BT-${datePart}-${sequence}`
}

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        vehicle: true,
        statusLogs: true,
      },
    })
  }

  async updateStatus(id: string, status: BookingStatus, changedBy: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
  })

  if (!booking) throw new Error('Booking not found')

  if (status === "DONE" && booking.status !== "CONFIRMED") {
    throw new Error("Only CONFIRMED booking can be marked as DONE")
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id },
      data: { status },
    })

    await tx.bookingStatusLog.create({
      data: {
        bookingId: id,
        oldStatus: booking.status,
        newStatus: status,
        changedBy,
      },
    })

    await tx.notification.create({
    data: {
      bookingId: id,
      title: "Booking Status Updated",
      message: `Your booking ${booking.bookingCode} is now ${status}`
    }
  })


    return { message: 'Status updated' }
    })
  }

  async getSchedule(date: string) {
  const targetDate = new Date(date)

  const bookings = await this.prisma.booking.findMany({
    where: {
      startDate: { lte: targetDate },
      endDate: { gte: targetDate },
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      startDate: 'asc',
    },
  })

  const vehiclesMap = new Map()

  for (const booking of bookings) {
    const vehicleId = booking.vehicle.id

    if (!vehiclesMap.has(vehicleId)) {
      vehiclesMap.set(vehicleId, {
        vehicleId: booking.vehicle.id,
        vehicleName: booking.vehicle.name,
        bookings: [],
      })
    }

    vehiclesMap.get(vehicleId).bookings.push({
      bookingId: booking.id,
      guestName: booking.guestName,
      pickup: booking.pickup,
      destination: booking.destination,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
    })
  }

  return {
    date,
    vehicles: Array.from(vehiclesMap.values()),
    }
  }

  async getDashboard() {

  const today = new Date()
  today.setHours(0,0,0,0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  // basic
  const bookingsToday = await this.prisma.booking.count({
    where: {
      createdAt: { gte: today, lt: tomorrow }
    }
  })

  const activeTrips = await this.prisma.booking.count({
    where: {
      startDate: { lte: today },
      endDate: { gte: today },
      status: "CONFIRMED"
    }
  })

  const vehiclesBusy = await this.prisma.booking.count({
    where: {
      startDate: { lte: today },
      endDate: { gte: today }
    }
  })

  const revenueToday = await this.prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: {
      createdAt: { gte: today, lt: tomorrow },
      paymentStatus: "PAID"
    }
  })

  // 🔥 NEW: STATUS COUNTS
  const statusCounts = await this.prisma.booking.groupBy({
    by: ['status'],
    _count: true
  })

  // 🔥 NEW: PAYMENT COUNTS
  const paymentCounts = await this.prisma.booking.groupBy({
    by: ['paymentStatus'],
    _count: true
  })

  // 🔥 NEW: UPCOMING TRIPS
  const upcomingTrips = await this.prisma.booking.findMany({
    where: {
      startDate: { gte: today },
      status: "CONFIRMED"
    },
    take: 5,
    orderBy: { startDate: 'asc' },
    include: { vehicle: true }
  })

  return {
    bookingsToday,
    activeTrips,
    vehiclesBusy,
    revenueToday: revenueToday._sum.totalPrice || 0,
    statusCounts,
    paymentCounts,
    upcomingTrips
  }
}


  async getCalendar(start?: string, end?: string) {
  const where: any = {}

  if (start && end) {
    where.startDate = {
      gte: new Date(start),
    }

    where.endDate = {
      lte: new Date(end),
    }
  }

  const bookings = await this.prisma.booking.findMany({
    where,
    include: {
      vehicle: true,
    },
  })

  return bookings.map((b) => ({
    id: b.id,
    title: `${b.vehicle.name} - ${b.guestName}`,
    start: b.startDate,
    end: b.endDate,
    extendedProps: {
      pickup: b.pickup,
      destination: b.destination,
      status: b.status,
    },
  }))
}

async updatePaymentStatus(id: string, status: string) {
  const booking = await this.prisma.booking.findUnique({
    where: { id },
  })

  if (!booking) throw new Error("Booking not found")

  let updateData: any = {
    paymentStatus: status,
  }

  // kalau DP → auto hitung 30%
  if (status === "DP_PENDING") {
    const dp = Number(booking.totalPrice) * 0.3

    updateData.dpAmount = dp
  }

  return this.prisma.booking.update({
    where: { id },
    data: updateData,
  })
}
}