import { Controller, Get } from '@nestjs/common'
import { PrismaService } from './database/prisma.service'

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('tenants')
  async tenants() {
  return this.prisma.tenant.findMany()
}
}