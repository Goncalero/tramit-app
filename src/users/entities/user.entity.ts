import { Desk } from "src/rooms/entities/desk.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { mayusName } from '../../common/mayus-name';


@Entity('users')
export class User{

    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'text' })
    name!: string

    @Column({
        type: 'text',
        unique: true,
    })
    email!: string

    @Column({ 
        type: 'text',
        select: false,
    })
    password!: string

    @Column({ 
        type: 'text',
        array: true,
        default: ['user']
    })
    roles!: string[]

    @Column({ 
        type: 'bool',
        default: true, 
    })
    isActive!: boolean

    // RELACIONES CON OTRAS TABLAS
    @OneToOne(
        () => Desk,
        ( desk ) => desk.user
    )
    @JoinColumn() //NECESARIO UNIR 2 TABLAS EN RELACION OneToOne()
    desk!: Desk | null

    // ANTES DE INSERTAR EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
     @BeforeInsert()
    checkNameMayusCase(){
        this.name = mayusName(this.name)
    }

    @BeforeInsert()
    checkEmailLowerCase(){
        this.email = this.email.toLowerCase()
    }

    // ANTES DE "MODIFICAR" EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
    @BeforeInsert()
    checkNameMayusCaseUpdate(){
      this.checkNameMayusCase()
    }

    @BeforeUpdate()
    checkNameLowerCaseUpdate(){
        this.checkEmailLowerCase()
    }
    
}