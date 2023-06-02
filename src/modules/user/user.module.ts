import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { getConfig } from 'lib/config'
import { UserService } from './user.service'
import { USER_MICROSERVICE } from './constants'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: USER_MICROSERVICE,
                useFactory: () => ({
                    transport: Transport.REDIS,
                    options: {
                        host: getConfig().redisConfig.host,
                        port: getConfig().redisConfig.port,
                        prefix: getConfig().microserviceConfig.userMicroservicePrefix
                    }
                })
            }
        ])
    ],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
