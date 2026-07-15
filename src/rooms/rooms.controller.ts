import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreateDeskDto } from './dto/create-desk.dto';
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


  @Get(':id')
  findOneRoom(@Param( 'id', ParseUUIDPipe ) id: string) {
    return this.roomsService.findOneRoom(id);
  }

  @Get('desks/:id')
  findOneDesk(@Param( 'id', ParseUUIDPipe ) id: string) {
    return this.roomsService.findOneDesk(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
