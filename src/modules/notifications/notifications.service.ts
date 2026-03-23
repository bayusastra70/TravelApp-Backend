import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class NotificationsService {

constructor(private prisma: PrismaService) {}

async create(data:{
bookingId?:string
title:string
message:string
}){
return this.prisma.notification.create({
data
})
}

async findAll(){
return this.prisma.notification.findMany({
where:{
isRead:false
},
orderBy:{
createdAt:'desc'
},
take:20
})
}

async unreadCount(){
return this.prisma.notification.count({
where:{
isRead:false
}
})
}

async markAsRead(id:string){
return this.prisma.notification.update({
where:{id},
data:{isRead:true}
})
}

}