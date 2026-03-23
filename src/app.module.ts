import { Module } from '@nestjs/common'
import { PrismaModule } from './database/prisma.module'
import { AppController } from './app.controller'
import { BookingsModule } from './modules/bookings/bookings.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AdminModule } from './modules/admin/admin.module'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [PrismaModule, BookingsModule, VehiclesModule, AdminModule, NotificationsModule],
  controllers: [AppController], 
})
export class AppModule {}