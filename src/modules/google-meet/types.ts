import { Role } from 'lib/common'

export type GoogleMeetAppointment = {
    appointmentUUID: string
    participants: Array<User>
    startDate: number
    endDate: number
}

export type User = {
    userUUID: string
    firstName: string
    lastName: string
    email: string
    role: Role
}
