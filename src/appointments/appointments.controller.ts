import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService
  ) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppoint(createAppointmentDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto ) {
    return this.appointmentsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.appointmentsService.findOneAppoint( term );
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.updateOneAppoint(term, updateAppointmentDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.appointmentsService.removeAppoint(term);
  }
}
