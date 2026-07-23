import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Desk } from './entities/desk.entity';
import { Room } from './entities/room.entity';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],

  imports: [ 
    TypeOrmModule.forFeature([ Desk, Room ]),
    TypeOrmModule,
  ],

  exports: [ RoomsService, TypeOrmModule ]
})

export class RoomsModule {}
