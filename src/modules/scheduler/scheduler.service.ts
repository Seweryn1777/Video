import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { SCHEDULER_MICROSERVICE } from './constants'
import { Appointment, SchedulerMicroserviceCommand } from './types'

@Injectable()
export class SchedulerService {
    constructor(@Inject(SCHEDULER_MICROSERVICE) private client: ClientProxy) {}

    getAppointment(appointmentUUID: string) {
        return lastValueFrom(
            this.client
                .send<Appointment | undefined, string>({ cmd: SchedulerMicroserviceCommand.GetAppointment }, appointmentUUID)
                .pipe(timeout(2500))
        ).catch(error => {
            throw new HttpException(error, error.code || HttpStatus.BAD_REQUEST)
        })
    }
}
