
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Desk } from '../../rooms/entities/desk.entity';
import { Tramit } from '../../tramits/entities/tramit.entity';
import { mayusName } from "src/common/mayus-name";


@Entity('appointments')
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type:'text' })
    citizenName!: string

    @Column({ 
        type:'text',
        unique: true
    })
    citizenEmail!: string

    @Column({ 
        type:'text',
        unique: true
     })
    citizenDni!: string

    @Column({ type:'text' })
    citizenPhone!: string

    @Column({ type:'timestamp' })
    appointmentDate!: Date
    
    @Column({ 
        type:'text',
        default: 'ASIGNADA'
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

    @BeforeInsert()
    checkNameMayusCase(){
        this.citizenName = mayusName(this.citizenName)
    }

     @BeforeInsert()
    checkNameMayusCaseUpdate(){
        this.checkNameMayusCase()
    }

    @BeforeInsert()
    checkEmailLowerCase(){
        this.citizenEmail = this.citizenEmail.toLowerCase()
    }

    @BeforeInsert()
    checkDniUpperCase(){
        this.citizenDni = this.citizenDni.toUpperCase()
    }


    @BeforeUpdate()
    checkEmailLowerCaseUpdate(){
        this.checkEmailLowerCase()
    }

    @BeforeUpdate()
    checkDniUpperCaseUpdate(){
        this.checkDniUpperCase()
    }
   
}
