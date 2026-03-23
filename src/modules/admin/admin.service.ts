import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { BookingStatus } from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getBookings(filters: {
    status?: BookingStatus
    date?: string
    vehicleId?: string
  }) {
    const where: any = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.vehicleId) {
      where.vehicleId = filters.vehicleId
    }

    if (filters.date) {
      const date = new Date(filters.date)

      where.startDate = {
        lte: date,
      }

      where.endDate = {
        gte: date,
      }
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        vehicle: true,
        statusLogs: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    })
  }
}