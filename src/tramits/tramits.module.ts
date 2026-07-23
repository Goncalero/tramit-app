import { Module } from '@nestjs/common';
import { TramitsService } from './tramits.service';
import { TramitsController } from './tramits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tramit } from './entities/tramit.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { DataSource } from 'typeorm';

@Module({
 
  controllers: [TramitsController],
  providers: [TramitsService],
  exports: [TypeOrmModule],
  imports:[ 
    TypeOrmModule.forFeature([ Tramit ]),
    RoomsModule,
    TypeOrmModule,
],
  
})
export class TramitsModule {}
