import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateDeskDto } from './dto/create-desk.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Desk } from './entities/desk.entity';
import { Room } from './entities/room.entity';



@Injectable()
export class RoomsService {

  constructor(
    @InjectRepository(Desk)
    private readonly deskRepository : Repository<Desk>,

    @InjectRepository(Room)
    private readonly roomRepository : Repository<Room>
  ){}

  async createRoom(createRoomDto: CreateRoomDto) {

    try {

      const roomBD = this.roomRepository.create(createRoomDto)
      await this.roomRepository.save(roomBD)

        return roomBD
      
    } catch (error) {

      this.handleDBExceptions(error)
    }
  }

  async createDesk(createDeskDto: CreateDeskDto) {

    try {

      const deskBD = this.deskRepository.create(createDeskDto)
      await this.deskRepository.save(deskBD)

      return deskBD
      
    } catch (error) {

      this.handleDBExceptions(error)
      
    }
  }


  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
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
