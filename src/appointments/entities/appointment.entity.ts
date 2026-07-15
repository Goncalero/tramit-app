
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Desk } from '../../rooms/entities/desk.entity';
import { Tramit } from '../../tramits/entities/tramit.entity';


@Entity('appointments')
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type:'text' })
    citizenName!: string

    @Column({ type:'text' })
    citizenEmail!: string

    @Column({ type:'text' })
    citizenDni!: string

    @Column({ type:'text' })
    citizenPhone!: string

    @Column({ type:'timestamp' })
    appointmentDate!: Date
    
    @Column({ 
        type:'text',
        default: 'PENDIENTE'
    })
    status!: string

    @Column({ 
        type:'text',
        nullable: true,
     })
    observations!: string

    @CreateDateColumn()
    createdAt!: Date


    // RELACIONES CON OTRAS TABLAS
    @ManyToOne(
        () => Desk,
        (desk) => desk.appointment,
    )
    desk!: Desk

    @ManyToOne(
        () => Tramit,
        (tramit) => tramit.appointment,
        { eager: true } // LO HACEMOS PARA QUE APAREZCA EL TRÁMITE DE LA CITA
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
        this.checkNameLowerCase()
    }

    @BeforeUpdate()
    checkEmailLowerCaseUpdate(){
        this.checkEmailLowerCase()
    }

    @BeforeUpdate()
    checkDniLowerCaseUpdate(){
        this.checkDniLowerCase()
    }
    // FUNCIÓN PARA QUE NOS MUESTRE LOS CAMPOS QUE QUERAMOS EN POSTMAN
    get formatoDeCitas(){
        const { desk, tramit, ...rest } = this

        return {
            ...rest,
            tramit:{
                ...tramit,
            room: {
                ...tramit.room,
            desk: {
                id: desk.id,
                deskNumber: desk.deskNumber
            }
            }
            }
        }

    }

}
