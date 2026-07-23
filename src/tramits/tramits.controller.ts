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

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.tramitsService.findOneTramit( term );
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateTramitDto: UpdateTramitDto) {
    return this.tramitsService.updateOneTramit(term, updateTramitDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.tramitsService.removeTramit(term);
  }
}
