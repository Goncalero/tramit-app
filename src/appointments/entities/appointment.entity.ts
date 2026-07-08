import { Desk } from "src/rooms/entities/desk.entity";
import { Tramit } from "src/tramits/entities/tramit.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('appointments')
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type:'text' })
    citizenName!: string

    @Column({ 
        type:'text',
        unique: true,
    })
    citizenEmail!: string

    @Column({ 
        type:'text',
        unique: true,
    })
    citizenDni!: string

    @Column({ 
        type:'text',
        unique: true,
    })
    citizenPhone!: string

    @Column({ type:'timestamp' })
    appointmentDate!: Date
    
    @Column({ 
        type:'text',
        default: 'PENDIENTE'
    })
    status!: string

    @Column({ type:'text' })
    observations!: string

    @CreateDateColumn()
    createdAt!: Date


    // RELACIONES CON OTRAS TABLAS
    @ManyToOne(
        () => Desk,
        (desk) => desk.appointment
    )
    desk!: Desk

    @ManyToOne(
        () => Tramit,
        (tramit) => tramit.appointment
    )
    tramit!: Tramit

    // ANTES DE "INSERTAR" EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
    @BeforeInsert()
    checkNameLowerCase(){
        this.citizenName = this.citizenName.toLowerCase()
    }

    @BeforeInsert()
    checkEmailLowerCase(){
        this.citizenEmail = this.citizenEmail.toLowerCase()
    }

    @BeforeInsert()
    checkDniLowerCase(){
        this.citizenDni = this.citizenDni.toLowerCase()
    }

    // ANTES DE "MODIFICAR" EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
    @BeforeUpdate()
    checkNameLowerCaseUpdate(){
        this.checkNameLowerCase
    }

    @BeforeUpdate()
    checkEmailLowerCaseUpdate(){
        this.checkEmailLowerCase
    }

    @BeforeUpdate()
    checkDniLowerCaseUpdate(){
        this.checkDniLowerCase
    }

}
