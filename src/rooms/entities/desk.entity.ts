import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
        (room) => room.desk,
        { eager: true } // LO HCEMOS PARA QUE APAREZCA TAMBÍEN LA SALA EN LA QUE ESTÁ LA MESA
    )
    room!: Room

    @JoinColumn() // ESTO SIRVE PARA HACER EL JOIN DE TABLAS
    @OneToOne(
        () => User,
        ( user ) => user.desk
    )
    user!: User

    @OneToMany(
        () => Appointment,
        (appointment) => appointment.desk
    )
    appointment!: Appointment[]


}