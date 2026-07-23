
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Desk } from 'src/rooms/entities/desk.entity';
import { Tramit } from 'src/tramits/entities/tramit.entity';
import { Appointment } from './entities/appointment.entity';
import { PaginationDto } from 'src/common/pagination.dto';
import { isUUID } from 'class-validator';
import { DataSource } from 'typeorm';



@Injectable()
export class AppointmentsService {

  constructor(
    @InjectRepository(Appointment)
      private readonly appointmentRepository : Repository<Appointment>,

    @InjectRepository(Desk)
      private readonly deskRepository : Repository<Desk>,

    @InjectRepository(Tramit)
      private readonly tramitRepository : Repository<Tramit>,

      //PARA PODER CREAR UNA queryRunner
      private readonly dataSource : DataSource

  ){}

  async createAppoint(createAppointmentDto: CreateAppointmentDto) {

    const { tramitId, appointmentDate} = createAppointmentDto //HACEMOS UN DESTRUCTURING DEL tramitId
    const parseDate = new Date(appointmentDate) //CONVERTIR A FECHA LEGIBLE

    const tramit = await this.tramitRepository.findOne({
       where: { id: tramitId },
       relations: { room: true } 
      })

    if ( !tramit )
    throw new NotFoundException('Error al encontrar el trámite')

    const roomId = tramit.room.id
    
    const desks = await this.deskRepository.find({
      where: { room: { id: roomId } }

    })
    const occupiedAppoint = await this.appointmentRepository.find({ //BUSCA LA desk Y date PARA SABER SI ESTÁ OCUPADA LA MESA A ESA HORA
      where: { appointmentDate: parseDate }, // ESTO ES LO MISMO QUE PONER EN LA RELACIÓN DE LA ENTIDAD {eager:true}
      relations: { desk: true } 
    });

    /*
      ALGORITMO DE ASIGNACIÓN AUTOMÁTICA DE MESAS
      - desks.find: RECORRE LAS MESAS Y SELECCIONA LA PRIMERA QUE CUMPLA LA CONDICIÓN
      - .some: COMPRUEBA SI LA MESA YA ESTÁ ASIGNADA A ALGUNA CITA DE ESA HORA
      - ! (negación): FILTRA PARA QUEDARSE UNICAMENTE CON LA MESA LIBRE
     */
    const availableDesk = desks.find( 
      desk => !occupiedAppoint.some( appointment => appointment.desk.id === desk.id
      ))

    if( !availableDesk )
      throw new NotFoundException('No hay mesas disponibles para esa fecha y hora')

    try {

      const appointment = this.appointmentRepository.create({
        ...createAppointmentDto,
        appointmentDate: parseDate,
        tramit,
        desk: availableDesk
      })

      await this.appointmentRepository.save( appointment )

      return appointment

    } catch (error) {

      this.handleDBExceptions(error)
      
    }
  }

  async findAll(paginationDto : PaginationDto) {

    const { limit = 10, offset } = paginationDto

    const allAppoint = await this.appointmentRepository.createQueryBuilder('appointment')

      .leftJoinAndSelect('appointment.tramit', 'tramit')
      .leftJoinAndSelect('tramit.room', 'room')
      .leftJoinAndSelect('appointment.desk', 'desk')
      .take(limit)
      .skip(offset)
      .getMany()

    return allAppoint
  }

  async findOneAppoint(term: string) {

    let oneAppoint : Appointment | null

    //SI PONEMOS EL UUID DE LA CITA ENTRA POR AQUI Y BUSCA POR id
    if(isUUID(term)){
       oneAppoint = await this.appointmentRepository.createQueryBuilder('appoint')
                  .where('appoint.id = :id', {id : term})
                  .leftJoinAndSelect('appoint.tramit', 'tramit')
                  .leftJoinAndSelect('tramit.room', 'room') //leftJoinAndSelect ES PARA UNIR LA TABLA Y MOSTRAR ESA PROPIEDAD
                  .leftJoinAndSelect('appoint.desk', 'desk') //leftJoin A SECAS UNE LA TABLA PERO NO MUESTRA LA PROPIEDAD
                  .getOne()
                  
    //SI PONEMOS EL NOMBRE DEL CIUDADANO ENTRA POR AQUI Y BUSCA POR citizenName
    }else{
      oneAppoint = await this.appointmentRepository.createQueryBuilder('appoint')
                  .where('unaccent(LOWER(appoint.citizenName)) = unaccent(LOWER(:citizenName))', {citizenName : term.toLowerCase()})
                  .leftJoinAndSelect('appoint.tramit', 'tramit')
                  .leftJoinAndSelect('tramit.room', 'room')
                  .leftJoinAndSelect('appoint.desk', 'desk')
                  .getOne()
    }
      if( !oneAppoint )
        throw new NotFoundException('Error al encontrar una cita en concreto')
      return oneAppoint
  }

  async updateOneAppoint(term: string, updateAppointmentDto: UpdateAppointmentDto) {

    const oneAppoint = await this.findOneAppoint(term)
    const modAppoint = await this.appointmentRepository.preload({
      id: oneAppoint.id,  
      ...updateAppointmentDto 
      })
    if( !modAppoint )
      throw new BadRequestException('Error al pre-cargar la Cita')

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await queryRunner.manager.save(modAppoint)
      await queryRunner.commitTransaction()
      return modAppoint

    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error);
        throw new BadRequestException('No se han podido modificar los datos de la cita, mira el LOG')
      
    }finally{
      await queryRunner.release()

    }



   
  }

  async removeAppoint(term: string) {

    const remAppoint = await this.findOneAppoint( term )
    await this.appointmentRepository.remove(remAppoint)
    return { message: `La cita asociada a ${term} ha sido eliminada` }
   
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
