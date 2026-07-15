import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreateTramitDto } from './dto/create-tramit.dto';
import { UpdateTramitDto } from './dto/update-tramit.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tramit } from './entities/tramit.entity';
import { Room } from 'src/rooms/entities/room.entity';



@Injectable()
export class TramitsService {


  constructor(
    @InjectRepository( Tramit )
    private readonly tramitRepository : Repository<Tramit>,

    @InjectRepository( Room )
    private readonly roomRepository : Repository<Room>
  ){}

  async createTramit(createTramitDto: CreateTramitDto) {

    const { room, ...tramitData} = createTramitDto
    
    //ESTO SE HACE ASÍ PORQUE ES UNA RELACION ManyToOne()
    const roomBD = await this.roomRepository.findOneBy({ id: room })
    if( !roomBD )
      throw new NotFoundException('La sala no exite')

    try {

      const tramitBD = this.tramitRepository.create({
        ...tramitData,
        room: roomBD
      })
      await this.tramitRepository.save(tramitBD)
    
      return tramitBD

    } catch (error) {

      this.handleDBExceptions(error)
    }
    }

  findAll() {
    return `This action returns all tramits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tramit`;
  }

  update(id: number, updateTramitDto: UpdateTramitDto) {
    return `This action updates a #${id} tramit`;
  }

  remove(id: number) {
    return `This action removes a #${id} tramit`;
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
