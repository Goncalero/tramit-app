import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "src/auth/entities/user.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";

@Entity('desk')
export class Desk{

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({
        type: 'int',
        default: 0,
    })
    deskNumber!: number


    // RELACIONES CON OTRAS TABLAS
    @ManyToOne(
        () => Room,
        (room) => room.desk
    )
    room!: Room

    @OneToOne(
        () => User,
        ( user ) => user.desk
    )
    user!: User

    @OneToMany(
        () => Appointment,
        (appointment) => appointment.desk
    )
    appointment!: Appointment


}