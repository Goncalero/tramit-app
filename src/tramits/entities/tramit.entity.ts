
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Room } from 'src/rooms/entities/room.entity';


@Entity('tramits')
export class Tramit {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({
        type: 'text',
        unique: true,
    })
    name!: string

    @Column({ type: 'text' })
    description!: string


    // RELACIONES CON OTRAS TABLAS
    @OneToMany(
        () => Appointment,
        (appointment) => appointment.tramit
    )
    appointment!: Appointment[]

    @ManyToOne(
        () => Room,
        (room) => room.tramit,
    )
    room!: Room

    // ANTES DE INSERTAR EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
    @BeforeInsert()
    checkNameLowerCase(){
        this.name = this.name.toLowerCase()
    }

    // ANTES DE "MODIFICAR" EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
    @BeforeUpdate()
    checkNameLowerCaseUpdate(){
        this.checkNameLowerCase()
    }

}
