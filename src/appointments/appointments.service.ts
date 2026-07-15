
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Desk } from 'src/rooms/entities/desk.entity';
import { Tramit } from 'src/tramits/entities/tramit.entity';
import { Appointment } from './entities/appointment.entity';
import { PaginationDto } from 'src/common/pagination.dto';



@Injectable()
export class AppointmentsService {

  constructor(
    @InjectRepository(Appointment)
      private readonly appointmentRepository : Repository<Appointment>,

    @InjectRepository(Desk)
      private readonly deskRepository : Repository<Desk>,

    @InjectRepository(Tramit)
      private readonly tramitRepository : Repository<Tramit>,

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

      //ESTÁ EN NUESTRO ENTITY, SIRVE PARA QUE APAREZCA TODA LA INFO EN tramits
      return appointment.formatoDeCitas 

    } catch (error) {

      this.handleDBExceptions(error)
      
    }
  }

  async findAll(paginationDto : PaginationDto) {

    const { limit = 10, offset } = paginationDto

    const allAppoint = await this.appointmentRepository.find(

      {
        take: limit,
        skip: offset,
        relations: {
          desk: true //EL NÚMERO DE MESA TAMBÍEN VIENE EN LA CONSULTA
        }
    
      }
    )

    return allAppoint
  }

  async findOne(id: string) {

    const oneAppoint = await this.appointmentRepository.findOne({
      where: { id },
      relations: { desk: true, tramit: { room: true } }
    })

    if( !oneAppoint )
      throw new NotFoundException('Error al encontrar una cita en concreto')

    return oneAppoint.formatoDeCitas
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
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
