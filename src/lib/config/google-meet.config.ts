import { EnvironmentVariables } from './environment.variables'

export const googleMeetConfig = (configEnvs: EnvironmentVariables) => ({
    googleServiceAccountClientEmail: configEnvs.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    googleServiceAccountPrivateKey: configEnvs.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    googleCalendarId: configEnvs.GOOGLE_CALENDAR_ID,
    googleImpersonationMail: configEnvs.GOOGLE_IMPERSONATION_MAIL,
    requiredScopes: ['https://www.googleapis.com/auth/calendar']
})
