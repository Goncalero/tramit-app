import { Desk } from "src/rooms/entities/desk.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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
    role!: string[]

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
    desk!: Desk

    // ANTES DE INSERTAR EN LA BASE DE DATOS, LO CONVIERTE EN MINÚSCULAS
    @BeforeInsert()
    checkNameLowerCase(){
        this.name = this.name.toLowerCase()
    }

    @BeforeInsert()
    checkEmailLowerCase(){
        this.email = this.email.toLowerCase()
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
    
}