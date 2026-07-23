import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreateRoomDto } from './dto/create-room.dto';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';
import { PaginationDto } from '../common/pagination.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

import { Desk } from './entities/desk.entity';
import { Room } from './entities/room.entity';

import { isUUID } from 'class-validator';


@Injectable()
export class RoomsService {

  constructor(
    @InjectRepository(Desk)
    private readonly deskRepository : Repository<Desk>,

    @InjectRepository(Room)
    private readonly roomRepository : Repository<Room>,

    private readonly dataSource : DataSource
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

    const { roomId } = createDeskDto
    const room = await this.roomRepository.findOneBy({id: roomId})

    if( !room )
      throw new NotFoundException('La sala con el id "${roomId}" no existe')
  
    try {

      const deskBD = this.deskRepository.create({
        ...createDeskDto,
        room
    })

      await this.deskRepository.save(deskBD)

      return deskBD
      
    } catch (error) {

      this.handleDBExceptions(error)
      
    }
  }


  async findAllRooms( paginationDto : PaginationDto) {

    const { limit = 5, offset } = paginationDto

    const allRooms = await this.roomRepository.find({

      take: limit,
      skip: offset,
    })
    return allRooms;
  }


  async findAllDesks( paginationDto : PaginationDto) {

    const { limit = 10, offset } = paginationDto

    const allRooms = await this.deskRepository.find({

      take: limit,
      skip: offset,
    })
    return allRooms;
  }


  async findOneRoom(term: string) {

    let oneRoom : Room | null

    if( isUUID(term) ) {

      oneRoom = await this.roomRepository.createQueryBuilder('room')
                .where('room.id = :id', { id : term })
                .leftJoinAndSelect('room.desk', 'desk')
                .getOne()

    } else{
        oneRoom = await this.roomRepository.createQueryBuilder('room')
                .where('unaccent(LOWER(room.name)) = unaccent(LOWER( :name))', { name : term.toLowerCase() })
                .leftJoinAndSelect('room.desk', 'desk')
                .getOne()
    }

    if( !oneRoom )
      throw new NotFoundException('Sala no encontrada')

    return oneRoom;
  }


  async findOneDesk(term: string) {

    let oneDesk: Desk | null

    if( isUUID(term) ){
        oneDesk = await this.deskRepository.createQueryBuilder('desk')
                  .where('desk.id = :id',{ id:term })
                  .leftJoinAndSelect('desk.room', 'room')
                  .leftJoinAndSelect('desk.user', 'user')
                  .getOne()

    }else{
      oneDesk = await this.deskRepository.createQueryBuilder('desk')
                  .where('unaccent(LOWER(desk.deskNumber)) = unaccent(LOWER(:deskNumber))',{ deskNumber:term })
                  .leftJoinAndSelect('desk.room', 'room')
                  .leftJoinAndSelect('desk.user', 'user')
                  .getOne()
    }

    if( !oneDesk )
      throw new NotFoundException('Mesa no encontrada')
    return oneDesk;
  }


  async updateOneRoom(term: string, updateRoomDto: UpdateRoomDto) {
  
    const oneRoom = await this.findOneRoom(term)

    const modRoom = await this.roomRepository.preload({
      id: oneRoom.id,
      ...updateRoomDto
  })

    if( !modRoom )
      throw new BadRequestException('No se puede pre-cargar la Sala')

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {

      await queryRunner.manager.save(modRoom)
      await queryRunner.commitTransaction()
      return modRoom
      
    } catch (error) {

      await queryRunner.rollbackTransaction()
      console.log(error);
      throw new BadRequestException('Error al modificar los datos')
    
    }finally{

      await queryRunner.release()
    }
  }

   async updateOneDesk(term: string, updateDeskDto: UpdateDeskDto) {
  
    
    const oneDesk = await this.findOneDesk(term)
    const modDesk = await this.deskRepository.preload({
      id: oneDesk.id,
      ...updateDeskDto
    })

    if( !modDesk )
      throw new BadRequestException('No se puede pre-cargar la Mesa')

      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()

    try {

      await queryRunner.manager.save(modDesk)
      await queryRunner.commitTransaction()
      return modDesk
      
    } catch (error) {

      await queryRunner.rollbackTransaction()
      console.log(error);
      throw new BadRequestException('Los datos de la Mesa no han podido ser modificados, consulta el LOG')
      
    }finally{

      await queryRunner.release()
    }
  }

   removeRoom(term: string) {

    throw new BadRequestException('No se puede eliminar ninguna sala por motivos de seguridad')
  }   

   removeDesk(term: string) {

    throw new BadRequestException('No se puede eliminar ningna mesa por motivos de seguridad')
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
