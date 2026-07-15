
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';

import { CreateLoginUserDto } from './dto/create-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/users/entities/user.entity';

import { JwtPayload } from './interfaces/jwt.payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>,
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
      this.handleDBExceptions(error)

    }
  }

  async createUser(createUserDto: CreateUserDto) {
  
      const { password, ...userData } = createUserDto
      const passwordHasheada = bcrypt.hashSync(password, 10)
      
      try {
  
        const userDB = this.userRepository.create({
          ...userData,
          password: passwordHasheada
      })
        await this.userRepository.save(userDB)
          return {
            ...userDB,
            token: this.getJwtToken({ id: userDB.id })

          }
  
      } catch (error) {
        this.handleDBExceptions(error)
  
      }
  }


  // HEMOS CREADO UN LOGGER PARA LA FUNCIÓN handleDBExceptions (MANEJO DE ERRORES)
  private readonly logger = new Logger('AppointmentService');

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
