import { plainToInstance } from 'class-transformer'
import { EnvironmentVariables } from './environment.variables'
import { bodyParserConfig } from './body-parser.config'
import { expressConfig } from './express.config'
import { throttlerConfig } from './throttler.config'
import { validationPipeConfig } from './validation-pipe.config'
import { corsConfig } from './cors.config'
import { healthCheckConfig } from './health-check.config'
import { authConfig } from './auth.config'
import { googleMeetConfig } from './google-meet.config'
import { microserviceConfig } from './microservice.config'
import { redisConfig } from './redis.config'
import { typeORMConfig } from './typeorm.config'

export const getConfig = () => {
    const configEnvs = plainToInstance(EnvironmentVariables, process.env, { enableImplicitConversion: true })

    return {
        bodyParserConfig: bodyParserConfig(configEnvs),
        expressConfig: expressConfig(configEnvs),
        throttlerConfig: throttlerConfig(configEnvs),
        validationPipeConfig: validationPipeConfig(),
        corsConfig: corsConfig(configEnvs),
        healthCheckConfig: healthCheckConfig(configEnvs),
        authConfig: authConfig(configEnvs),
        googleMeetConfig: googleMeetConfig(configEnvs),
        redisConfig: redisConfig(configEnvs),
        microserviceConfig: microserviceConfig(configEnvs),
        typeORMConfig: typeORMConfig(configEnvs)
    }
}
