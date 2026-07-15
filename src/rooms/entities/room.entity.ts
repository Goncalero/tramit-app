
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Desk } from "./desk.entity";
import { Tramit } from '../../tramits/entities/tramit.entity';



@Entity('rooms')
export class Room {

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
        () => Desk,
        (desk) => desk.room
    )
    desk!: Desk[]

    @OneToMany(
        () => Tramit,
        (tramit) => tramit.room,
    )
    tramit!: Tramit[]
    
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
