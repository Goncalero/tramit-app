import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

  constructor(
     @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto
    const passwordHasheada = bcrypt.hashSync(password, 10)
    

    try {

      const userDB = this.userRepository.create({
        ...userData,
        password: passwordHasheada
    })
      await this.userRepository.save(userDB)
        return userDB

    } catch (error) {
      this.handleDBExceptions(error)

    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
