import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ErrorResponse, User } from 'lib/types'
import { en_US } from 'lib/locale'
import { Role } from 'lib/common'
import { AppointmentEntity } from 'lib/entities'
import { GoogleMeetService } from 'modules/google-meet'
import { SchedulerService } from 'modules/scheduler'
import { UserService } from 'modules/user'

const T = en_US

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,
        private readonly googleMeetService: GoogleMeetService,
        private readonly schedulerService: SchedulerService,
        private readonly userService: UserService
    ) {}

    async joinRoom(appointmentUUID: string, user: User) {
        const appointment = await this.schedulerService.getAppointment(appointmentUUID)

        if (!appointment) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                message: T.appointment.appointmentNotFound
            }

            throw new BadRequestException(error)
        }

        const userUUID = user.role === Role.Teacher ? appointment.teacherUUID : appointment.studentUUID

        if (user.userUUID !== userUUID) {
            throw new BadRequestException()
        }

        const videoAppointment = await this.getVideoAppointment(appointmentUUID)

        if (videoAppointment) {
            return videoAppointment.googleMeetUrl
        }

        const [student, teacher] = await Promise.all([
            this.userService.getUser({ userUUID: appointment.studentUUID, role: Role.Student }),
            this.userService.getUser({ userUUID: appointment.studentUUID, role: Role.Teacher })
        ])

        if (!student || !teacher) {
            const error: ErrorResponse = {
                code: HttpStatus.BAD_REQUEST,
                message: T.user.userNotFound
            }

            throw new BadRequestException(error)
        }

        const googleMeetAppointment = {
            appointmentUUID,
            participants: [student, teacher],
            startDate: appointment.startDate,
            endDate: appointment.endDate
        }

        const googleMeetUrl = await this.googleMeetService.generateLink(googleMeetAppointment)

        if (!googleMeetUrl) {
            throw new Error()
        }

        this.saveVideoAppointment(appointmentUUID, googleMeetUrl, appointment.startDate)

        return googleMeetUrl
    }

    private getVideoAppointment(appointmentUUID: string) {
        return this.appointmentRepository.findOne({ where: { appointmentUUID } })
    }

    private saveVideoAppointment(appointmentUUID: string, googleMeetUrl: string, startDate: number) {
        return this.appointmentRepository.save({
            appointmentUUID,
            googleMeetUrl,
            startDate
        })
    }
}
