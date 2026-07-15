import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/pagination.dto';



@Injectable()
export class UsersService {

  constructor(
     @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){}


  async findAllUsers( paginationDto : PaginationDto ) {

    const { limit = 10, offset } = paginationDto
    const allUsers = await this.userRepository.find({

      take: limit,
      skip: offset,
    })

    return allUsers;
  }

  async findOneUser(id: string) {

    const oneUser = await this.userRepository.findOneBy({id: id})
    
    return oneUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }   
}
