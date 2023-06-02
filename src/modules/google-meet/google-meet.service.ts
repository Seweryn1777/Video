import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { formatRFC3339, fromUnixTime } from 'date-fns'
import { google } from 'googleapis'
import { Role } from 'lib/common'
import { en_US } from 'lib/locale'
import { getConfig } from 'lib/config'
import { ErrorResponse } from 'lib/types'
import { GOOGLE_MEET_ERROR_TITLE, GOOGLE_MEET_GET_LINK_ERROR } from './constants'
import { GoogleMeetAppointment } from './types'

const T = en_US

@Injectable()
export class GoogleMeetService {
    private readonly calendar
    private readonly logger = new Logger()

    constructor() {
        const { googleServiceAccountPrivateKey, googleImpersonationMail, requiredScopes, googleServiceAccountClientEmail } =
            getConfig().googleMeetConfig

        const auth = new google.auth.JWT(
            googleServiceAccountClientEmail,
            undefined,
            googleServiceAccountPrivateKey,
            requiredScopes,
            googleImpersonationMail
        )
        this.calendar = google.calendar({ auth, version: 'v3' })
    }

    async generateLink(appointment: GoogleMeetAppointment) {
        const { appointmentUUID, participants, startDate, endDate } = appointment
        const { googleCalendarId } = getConfig().googleMeetConfig

        participants.forEach(participant => {
            if (!participant.email) {
                const error: ErrorResponse = {
                    code: HttpStatus.BAD_REQUEST,
                    message: T.user.userNotFound
                }

                throw new BadRequestException(error)
            }
        })

        const attendees = participants.map(participant => ({
            email: participant.email,
            displayName: `${participant.firstName} ${participant.lastName}`,
            organizer: !(participant.role === Role.Student),
            comment: participant.userUUID
        }))
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

        return this.calendar.events
            .insert({
                calendarId: googleCalendarId,
                conferenceDataVersion: 1,
                requestBody: {
                    summary: appointmentUUID,
                    conferenceData: {
                        createRequest: {
                            requestId: appointmentUUID
                        }
                    },
                    start: {
                        timeZone,
                        dateTime: formatRFC3339(fromUnixTime(startDate))
                    },
                    end: {
                        timeZone,
                        dateTime: formatRFC3339(fromUnixTime(endDate))
                    },
                    id: appointmentUUID,
                    attendees,
                    guestsCanInviteOthers: false,
                    visibility: 'private'
                }
            })
            .then(response => response.data.hangoutLink)
            .catch(error => {
                this.logger.error(GOOGLE_MEET_ERROR_TITLE, error)

                return undefined
            })
    }
}
