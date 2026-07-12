import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateLoginUserDto } from './dto/create-user.dto';
import { UpdateLoginUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';




@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
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
      return userProperties

    } catch (error) {
      this.handleDBExceptions(error)

    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateLoginUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
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
}
