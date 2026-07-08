import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TramitsService } from './tramits.service';
import { CreateTramitDto } from './dto/create-tramit.dto';
import { UpdateTramitDto } from './dto/update-tramit.dto';

@Controller('tramits')
export class TramitsController {
  constructor(private readonly tramitsService: TramitsService) {}

  @Post()
  create(@Body() createTramitDto: CreateTramitDto) {
    return this.tramitsService.create(createTramitDto);
  }

  @Get()
  findAll() {
    return this.tramitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramitsService.findOne(+id);
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
