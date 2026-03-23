import { Controller, Get, Query, Post, Body, Param, UploadedFile, UseInterceptors, Patch, Delete } from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import type { Express } from 'express'

@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  async findAll() {
    return this.vehiclesService.findAll()
  }

  @Get('available')
  async available(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.vehiclesService.findAvailable(startDate, endDate)
  }

  @Get(':id/calendar')
   async getCalendar(
     @Param('id') id: string,
     @Query('month') month: string,
   ) {
     return this.vehiclesService.getVehicleCalendar(id, month)
   }

   @Post()
   async create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto)
   }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, uniqueName + extname(file.originalname))
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/${file.filename}`,
    }
  }

  @Patch(':id')
update(@Param('id') id: string, @Body() dto: any) {
  return this.vehiclesService.update(id, dto)
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.vehiclesService.remove(id)
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.vehiclesService.findOne(id)
}
}