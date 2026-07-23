import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDeepPartialEntity, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/pagination.dto';
import { isUUID } from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {

  constructor(
     @InjectRepository(User)
    private readonly userRepository : Repository<User>,

    private readonly dataSource : DataSource
  ){}


  async findAllUsers( paginationDto : PaginationDto ) {

    const { limit = 10, offset } = paginationDto
    const allUsers = await this.userRepository.find({

      take: limit,
      skip: offset,
      where: {isActive: true}, //SOLO NOS MUESTRA LOS USUARIOS ACTIVOS
      relations: {desk: true}
    })

    return allUsers;
  }

  async findOneUser(term: string) {

    let oneUser : User | null

    if( isUUID(term) ){

      oneUser = await this.userRepository.createQueryBuilder('user')
                .where('user.id = :id', { id: term })
                .andWhere('user.isActive = :isActive', { isActive:true }) //BUSCA SI EL user ESTÁ ACTIVO
                .leftJoinAndSelect('user.desk', 'desk')
                .getOne()

    }else{

      oneUser = await this.userRepository.createQueryBuilder('user')
                .where('unaccent(LOWER(user.name )) = unaccent(LOWER(:name))', { name : term.toLowerCase() })
                .andWhere('user.isActive = :isActive', { isActive:true }) //BUSCA SI EL user ESTÁ ACTIVO
                .leftJoinAndSelect('user.desk', 'desk')
                .getOne()
    }
    if( !oneUser )
      throw new NotFoundException('Usuario no encontrado')
    
    return oneUser;
  }

  async updateOneUser(term: string, updateUserDto: UpdateUserDto) {

    const oneUser = await this.findOneUser(term)
    const modUser = await this.userRepository.preload({
      id: oneUser.id,
      ...updateUserDto
    })
    if( !modUser )
      throw new BadRequestException('No se puede pre-cargar el usuario')

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      await queryRunner.manager.save(modUser)
      await queryRunner.commitTransaction()
      return modUser
      
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error);
        throw new BadRequestException('No se han podido modificar los datos del Usuario')

    }finally{
      await queryRunner.release()

    }
  }

  async changeRoleUser(term: string, roles: ValidRoles[]){

    const changeRole = await this.findOneUser(term)
    changeRole.roles = roles
    await this.userRepository.save(changeRole)

    return { message: 'Rol del usuario actualizado' }
  }

  async resetPasswordUser(term: string, newPassword: string){

    const resetPassword = await this.findOneUser(term) 

    resetPassword.password = bcrypt.hashSync(newPassword, 10)
    
    await this.userRepository.save(resetPassword)

    return { message: 'Contraseña actualizada correctamente' }

  }

  async inactiveUser(term: string){

      if( !isUUID(term) ) //SI NO ES UN uuid VÁLIDO
        throw new BadRequestException('El id del usuario no tiene el formato válido')

         const inactUser = await this.userRepository.createQueryBuilder()
                    .update(User)
                    .set({ isActive: false, desk: null})
                    .where('id = :id', { id: term })
                    .execute()
    
    if( inactUser.affected === 0 )
      throw new NotFoundException('Usuario no encontrado')

    return { message: 'Usuario desactivado correctamente' }
  }

  async activeUser(term: string, deskId: string){

    if( !isUUID(term) ) //SI NO ES UN uuid VÁLIDO DE user
      throw new BadRequestException('El id del usuario no tiene el formato válido')

    if( !isUUID(deskId) ) //SI NO ES UN uuid VÁLIDO DE desk
      throw new BadRequestException('El id de la mesa no tiene el formato válido')

    
    const deskOccuped = await this.userRepository.findOne({
      where: { desk: { id: deskId } }
    })

     if(deskOccuped)
      throw new BadRequestException('Mesa ocupada por otro usuario, prueba con otro id de Mesa')

    //ESTO SIRVE PARA QUE LUEGO NOS ASIGNE UNA desk CUANDO ACTIVEMOS AL user
    const updateValues : QueryDeepPartialEntity<User> = {
      isActive: true,
      desk: { id: deskId }
    }   
    const inactUser = await this.userRepository.createQueryBuilder()
                  .update(User)
                  .set(updateValues) //LE PASAMOS EL updateValues ANTERIOR
                  .where('id = :id', { id: term })
                  .execute()
  
  if( inactUser.affected === 0 )
    throw new NotFoundException('Usuario no encontrado')

  return { message: 'Usuario activado y mesa asignada correctamente' }
}

  async removeUser(term: string) {

    const remUser = await this.findOneUser(term)
    await this.userRepository.remove(remUser)

    return {message: 'El usuario ha sido eliminado correctamente'};
  }   
}
