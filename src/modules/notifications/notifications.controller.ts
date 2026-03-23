import { Controller, Get, Patch, Param } from '@nestjs/common'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
export class NotificationsController {

constructor(private service:NotificationsService){}

@Get()
findAll(){
return this.service.findAll()
}

@Get('unread-count')
unread(){
return this.service.unreadCount()
}

@Patch(':id/read')
read(@Param('id') id:string){
return this.service.markAsRead(id)
}

}