import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreateTramitDto } from './dto/create-tramit.dto';
import { UpdateTramitDto } from './dto/update-tramit.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tramit } from './entities/tramit.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { PaginationDto } from 'src/common/pagination.dto';
import { isUUID } from 'class-validator';
import { DataSource } from 'typeorm';



@Injectable()
export class TramitsService {


  constructor(
    @InjectRepository( Tramit )
    private readonly tramitRepository : Repository<Tramit>,

    @InjectRepository( Room )
    private readonly roomRepository : Repository<Room>,

    private readonly dataSource : DataSource

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


  async findAllTramits( paginationDto : PaginationDto ) {

    const { limit = 5, offset } = paginationDto

    const allTramits = await this.tramitRepository.createQueryBuilder('tramit')
      .leftJoinAndSelect('tramit.room', 'room')
      .leftJoin('room.desk', 'desk')
      .addSelect( ['desk.id', 'desk.deskNumber'] )
      .take(limit)
      .skip(offset)
      .getMany()
    
    return allTramits;
  }


  async findOneTramit(term: string) {

    let oneTramit : Tramit | null

    if( isUUID(term) ){
        oneTramit = await this.tramitRepository.createQueryBuilder('tramit')
                  .where('tramit.id = :id',{ id:term })
                  .leftJoinAndSelect('tramit.room', 'room')
                  .leftJoinAndSelect('room.desk', 'desk')
                  .getOne()
 
    }else{ 
       oneTramit = await this.tramitRepository.createQueryBuilder('tramit')
                  .where('unaccent(LOWER(tramit.name)) = unaccent(LOWER(:name))',{ name:term.toLowerCase() })
                  .leftJoinAndSelect('tramit.room', 'room')
                  .leftJoinAndSelect('room.desk', 'desk')
                  .getOne()
  }
    if( !oneTramit )
      throw new NotFoundException('Trámite no encontrado')

    return oneTramit
  }
  
  async updateOneTramit(term: string, updateTramitDto: UpdateTramitDto) {

    const { room, ...restProperties } = updateTramitDto

    const oneTramit = await this.findOneTramit(term)

    const modTramit = await this.tramitRepository.preload({ 
      id: oneTramit.id, 
      ...restProperties,
      room: room ? { id: room } : undefined
     })

    if( !modTramit )
      throw new BadRequestException('No se puede pre-cargar la información del trámite')

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()


    try {

    await queryRunner.manager.save(modTramit)
    await queryRunner.commitTransaction()
    return modTramit

    } catch (error) {

      await queryRunner.rollbackTransaction()
      console.log(error);
      throw new BadRequestException('Error al modificar los datos del trámite')
      
    } finally{

      await queryRunner.release()
    }
  }
  /* SI EL updateOneTramit QUEREMOS HACERLO CON queryRunner SERÍA ASÍ

  async updateOneTramit(term: string, updateTramitDto: UpdateTramitDto) {

    const { room, ...restProperties } = updateTramitDto

    const oneTramit = await this.findOneTramit(term)

    const preloadTramit = await this.tramitRepository.preload({ room: { id: room } , id: oneTramit.id, ...restProperties })

    if( !preloadTramit )
      throw new BadRequestException('No se puede pre-cargar la información del trámite')

    const saveTramit = await this.tramitRepository.save(preloadTramit)


    return saveTramit;
  }  */

  removeTramit(term: string) {

    throw new BadRequestException('No se puede eliminar ningún trámite por motivos de seguridad')
  }   
  /*  SI QUISIERAMOS BORRA EL TRÁMITE PARA SIEMPRE, LO HACEMOS ASÍ,
  Y ACTIVAMOS Cascade: true EN LA RELACIÓN DE LA CITA

  async removeTramit(term: string) {

    const remTramit = await this.findOneTramit(term)
    await this.tramitRepository.remove(remTramit)

    return {message: `El trámite ${term} ha sido eliminado`};
  }   */


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
