import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppointmentEntity } from 'lib/entities'
import { GoogleMeetModule } from 'modules/google-meet'
import { SchedulerModule } from 'modules/scheduler'
import { UserModule } from 'modules/user'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'

@Module({
    imports: [SchedulerModule, UserModule, GoogleMeetModule, TypeOrmModule.forFeature([AppointmentEntity])],
    controllers: [RoomController],
    providers: [RoomService]
})
export class RoomModule {}
