import { Role } from 'lib/common'

export enum UserMicroserviceCommand {
    GetUser = 'get-user'
}

export type GetUser = {
    userUUID: string
    role: Role
}

export type User = {
    userUUID: string
    firstName: string
    lastName: string
    email: string
    role: Role
}
