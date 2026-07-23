import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { TramitsModule } from 'src/tramits/tramits.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [ TypeOrmModule, AppointmentsService ],
  imports: [ 
    RoomsModule,
    TramitsModule,
    TypeOrmModule,
    TypeOrmModule.forFeature([ Appointment ]),
  ],
})
export class AppointmentsModule {}
