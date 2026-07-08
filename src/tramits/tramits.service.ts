import { Injectable } from '@nestjs/common';
import { CreateTramitDto } from './dto/create-tramit.dto';
import { UpdateTramitDto } from './dto/update-tramit.dto';

@Injectable()
export class TramitsService {
  create(createTramitDto: CreateTramitDto) {
    return 'This action adds a new tramit';
  }

  findAll() {
    return `This action returns all tramits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tramit`;
  }

  update(id: number, updateTramitDto: UpdateTramitDto) {
    return `This action updates a #${id} tramit`;
  }

  remove(id: number) {
    return `This action removes a #${id} tramit`;
  }
}
