export enum SchedulerMicroserviceCommand {
    GetAppointment = 'get-appointment'
}

export type Appointment = {
    appointmentUUID: string
    studentUUID: string
    teacherUUID: string
    startDate: number
    endDate: number
}
