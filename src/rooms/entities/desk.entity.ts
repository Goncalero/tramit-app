import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from '../../users/entities/user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { mayusName } from "src/common/mayus-name";



@Entity('desk')
export class Desk{

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({
        type: 'text'
    })
    deskNumber!: string


    // RELACIONES CON OTRAS TABLAS
    @ManyToOne(
        () => Room,
        (room) => room.desk,
        { eager: true } // LO HCEMOS PARA QUE APAREZCA TAMBÍEN LA SALA EN LA QUE ESTÁ LA MESA
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
    appointment!: Appointment[]

// ANTES DE "INSERTAR" EN LA BASE DE DATOS,CONVIERTE LA PRIMERA EN MAYÚSCULA
    @BeforeInsert()
    checkNameLowerCase(){
        this.deskNumber = mayusName(this.deskNumber)
    }

    @BeforeUpdate()
    checkDeskNameLowerCaseUpdate(){
        this.checkNameLowerCase()
    }
}