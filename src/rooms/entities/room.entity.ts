
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Desk } from "./desk.entity";
import { Tramit } from '../../tramits/entities/tramit.entity';
import { mayusName } from '../../common/mayus-name';



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
    
    // ANTES DE INSERTAR EN LA BASE DE DATOS, CONVIERTE EN MAYÚSCULA LA PRIMERA LETRA
    @BeforeInsert()
    checkNameLowerCase(){
        this.name = mayusName(this.name)
    }

    // ANTES DE "MODIFICAR" EN LA BASE DE DATOS, CONVIERTE EN MAYÚSCULA LA PRIMERA LETRA
    @BeforeUpdate()
    checkNameLowerCaseUpdate(){
        this.checkNameLowerCase()
    }
}
