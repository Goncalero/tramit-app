import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { RoomsService } from './rooms.service';

import { CreateRoomDto } from './dto/create-room.dto';
import { CreateDeskDto } from './dto/create-desk.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateDeskDto } from './dto/update-desk.dto';
import { PaginationDto } from 'src/common/pagination.dto';


@Controller('rooms')
export class RoomsController {
  constructor( private readonly roomsService: RoomsService ) {}


  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Post('desks')
  createDesk(@Body() createDeskDto: CreateDeskDto) {
    return this.roomsService.createDesk(createDeskDto);
  }

  @Get()
  findAllRooms( @Query() paginationDto : PaginationDto ) {
    return this.roomsService.findAllRooms( paginationDto );
  }

  @Get('desks')
  findAllDesks( @Query() paginationDto : PaginationDto ) {
    return this.roomsService.findAllDesks( paginationDto );
  }


  @Get(':term')
  findOneRoom(@Param( 'term' ) term: string) {
    return this.roomsService.findOneRoom( term );
  }

  @Get('desks/:term')
  findOneDesk(@Param( 'term' ) term: string) {
    return this.roomsService.findOneDesk( term );
  }

  @Patch(':term')
  updateRoom(@Param('term') term: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.updateOneRoom(term, updateRoomDto);
  }

  @Patch('desks/:term')
  updateDesk(@Param('term') term: string, @Body() updateDeskDto: UpdateDeskDto) {
    return this.roomsService.updateOneDesk(term, updateDeskDto);
  }


  @Delete(':term')
  removeRoom(@Param('term') term: string) {
    return this.roomsService.removeRoom(term);
  }

  @Delete(':term')
  removeDesk(@Param('term') term: string) {
    return this.roomsService.removeDesk(term);
  }
}
