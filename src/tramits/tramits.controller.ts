import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { TramitsService } from './tramits.service';
import { CreateTramitDto } from './dto/create-tramit.dto';
import { UpdateTramitDto } from './dto/update-tramit.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Controller('tramits')
export class TramitsController {
  constructor(private readonly tramitsService: TramitsService) {}

  @Post()
  create(@Body() createTramitDto: CreateTramitDto) {
    return this.tramitsService.createTramit(createTramitDto);
  }

  @Get()
  findAll( @Query() paginationDto : PaginationDto ) {
    return this.tramitsService.findAllTramits(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tramitsService.findOneTramit(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTramitDto: UpdateTramitDto) {
    return this.tramitsService.update(+id, updateTramitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramitsService.remove(+id);
  }
}
