import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAvailable(startDate: string, endDate: string) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        isActive: true,
        bookings: {
          none: {
            OR: [
              {
                startDate: { lte: end },
                endDate: { gte: start },
              },
            ],
          },
        },
      },
    })

    return vehicles
  }

  async findAll() {
    return this.prisma.vehicle.findMany({
      where: {
        isActive: true,
      },
    })
  }

  async getVehicleCalendar(vehicleId: string, month: string) {
  const start = new Date(`${month}-01`)
  const end = new Date(start)
  end.setMonth(end.getMonth() + 1)

  const bookings = await this.prisma.booking.findMany({
    where: {
  vehicleId,
  status: {
    not: "CANCELLED"
  },
  startDate: { lte: end },
  endDate: { gte: start },
}
  })

  const bookedDates: string[] = []

  bookings.forEach((booking) => {
    let current = new Date(booking.startDate)

    while (current <= booking.endDate) {
      bookedDates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
  })

  return {
    vehicleId,
    bookedDates,
    }
  }

  async create(dto: CreateVehicleDto) {

  const tenant = await this.prisma.tenant.findUnique({
    where: {
      slug: process.env.TENANT_SLUG,
    },
  })

  if (!tenant) {
    throw new BadRequestException("Tenant not found")
  }

  try {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        name: dto.name,
        type: dto.type,
        plateNumber: dto.plateNumber,
        capacity: dto.capacity,
        price: dto.price,
        imageUrl: dto.imageUrl,
        isActive: dto.isActive ?? true,

        // 🔥 WAJIB
        tenantId: tenant.id,
      },
    })

    return vehicle
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new BadRequestException(
        `Vehicle with plate number ${dto.plateNumber} already exists`
      )
    }
    throw error
  }
}

async update(id: string, dto: any) {
  return this.prisma.vehicle.update({
    where: { id },
    data: dto,
  })
}

async remove(id: string) {

  const bookings = await this.prisma.booking.findFirst({
    where: { vehicleId: id }
  })

  if (bookings) {
    throw new BadRequestException(
      "Vehicle already used in booking"
    )
  }

  return this.prisma.vehicle.delete({
    where: { id },
  })
}

async findOne(id: string) {
  return this.prisma.vehicle.findUnique({
    where: { id },
  })
}
}
