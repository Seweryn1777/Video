import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { getConfig } from 'lib/config'
import { SchedulerService } from './scheduler.service'
import { SCHEDULER_MICROSERVICE } from './constants'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: SCHEDULER_MICROSERVICE,
                useFactory: () => ({
                    transport: Transport.REDIS,
                    options: {
                        host: getConfig().redisConfig.host,
                        port: getConfig().redisConfig.port,
                        prefix: getConfig().microserviceConfig.schedulerMicroservicePrefix
                    }
                })
            }
        ])
    ],
    providers: [SchedulerService],
    exports: [SchedulerService]
})
export class SchedulerModule {}
