import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'appointment' })
export class AppointmentEntity {
    @PrimaryColumn()
    appointmentUUID: string

    @Column()
    startDate: number

    @Index()
    @Column()
    googleMeetUrl: string

    @CreateDateColumn({ select: false })
    createdAt: Date

    @UpdateDateColumn({ select: false })
    updatedAt: Date
}
