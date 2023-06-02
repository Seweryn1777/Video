## Video microservice
    Video microservice is a key part of a language platform application based on microservice architecture and NestJS framework.
    Its main task is to manage video meetings between teachers and students. Here is a brief description of the functions of this microservice:

    Creates a link to Google Meet: Video microservice allows student and teacher to create unique links to video meetings using the Google Meet platform.
    Based on the unique appointmentUUID (generated within the Appointment module), a link is created that serves as a virtual meeting place for the teacher and student.

## Code example

Join the room. Checks if the video meeting has already been generated if yes it returns the link already created if not it creates a new one:

```javascript
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
```

Generate link to google meet:

```javascript
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
```