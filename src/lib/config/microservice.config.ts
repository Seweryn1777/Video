import { EnvironmentVariables } from './environment.variables'

export const microserviceConfig = (configEnvs: EnvironmentVariables) => ({
    videoMicroservicePrefix: configEnvs.VIDEO_MICROSERVICE_PREFIX,
    schedulerMicroservicePrefix: configEnvs.SCHEDULER_MICROSERVICE_PREFIX,
    userMicroservicePrefix: configEnvs.USER_MICROSERVICE_PREFIX
})
