import { Controller, Post, Body } from '@nestjs/common'
import { Roles, UserDecorator } from 'lib/decorators'
import { Role } from 'lib/common'
import { User } from 'lib/types'
import { RoomService } from './room.service'
import { JoinRoomDto } from './dto'
import { ROOM } from './constants'

@Controller(ROOM)
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post('join')
    @Roles(Role.Student, Role.Teacher)
    joinRoom(@Body() dto: JoinRoomDto, @UserDecorator() user: User) {
        return this.roomService.joinRoom(dto.appointmentUUID, user)
    }
}
