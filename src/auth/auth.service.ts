
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';

import { CreateLoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../users/entities/user.entity';
import { Desk } from '../rooms/entities/desk.entity';

import { JwtPayload } from './interfaces/jwt.payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
    @InjectRepository(Desk)
    private readonly deskRepository : Repository<Desk>,

    private readonly jwtService : JwtService
  ){}


  async login(createLoginUserDto: CreateLoginUserDto) {

    const { email, password } = createLoginUserDto

    try {

      const loginDB = await this.userRepository.createQueryBuilder('user')
                                                .where('user.email = :email', {email})
                                                .addSelect('user.password')
                                                .getOne()
      if(!loginDB)
        throw new UnauthorizedException('Error al obtener las credenciales')

      if(!bcrypt.compareSync(password, loginDB.password))
        throw new UnauthorizedException('Error al obtener las credenciales')

      //PARA QUE NO APAREZCA LA CONTRASEÑA EN LA CONSULTA DEL LOGIN EN POSTMAN
      //DESESTRUCTURAMOS, RENOMBRAMOS password PARA QUE NO SE REPITA Y HACEMOS return
      const { password: deletePassword, ...userProperties } = loginDB
      return {
        ...userProperties,
        token: this.getJwtToken({ id: loginDB.id })

      } 

    } catch (error) {
      //SI ME DA UN ERROR 500, LO MANEJO AQUI TAMBIÉN
      if(error instanceof UnauthorizedException) throw error
      this.handleDBExceptions(error)

    }
  }

  async createUser(createUserDto: CreateUserDto) {
  
      const { password, ...userData } = createUserDto
      const passwordHasheada = bcrypt.hashSync(password, 10)
      const desks = await this.deskRepository.find({
        relations: { user: true }
      })

      const avaiableDesk = await this.deskRepository.createQueryBuilder('desk')
                          .where('user.id IS NULL')
                          .leftJoin('users', 'user', 'user.deskId = desk.id') //UNIR TABLAS
                          .getOne()

      if( !avaiableDesk ){
        throw new BadRequestException('No hay mesas libres de trabajo')
      }
      
      try {
  
        const userDB = this.userRepository.create({
          ...userData,
          password: passwordHasheada,
          desk: avaiableDesk,
      })
        await this.userRepository.save(userDB)
        
        //PARA BORRAR QUE NO VUELVA A APARECER EL user EN POSTMAN AL CREAR
        if( userDB.desk ){
          delete (userDB.desk as any).user
        }

          return {
            ...userDB,
            token: this.getJwtToken({ id: userDB.id })

          }
  
      } catch (error) {
        this.handleDBExceptions(error)
  
      }
  }

  // HEMOS CREADO UN LOGGER PARA LA FUNCIÓN handleDBExceptions (MANEJO DE ERRORES)
  private readonly logger = new Logger('AuthService');

  //CREAMOS UNA FUNCIÓN PARA EL MANEJO DE ERRORES, Y ASI PODER USARLO DONDE QUERAMOS
  private handleDBExceptions( error: any ) {
      console.log(error);
      if ( error.code === '23505' )
        throw new BadRequestException(error.detail)

      this.logger.error(error)
      throw new InternalServerErrorException('Error inesperado, chequea los logs del servidor')
  }

  private getJwtToken( payload: JwtPayload ){

    const token = this.jwtService.sign(payload)
    return token
  }
}
