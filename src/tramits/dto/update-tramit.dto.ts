import { PartialType } from '@nestjs/mapped-types';
import { CreateTramitDto } from './create-tramit.dto';

export class UpdateTramitDto extends PartialType(CreateTramitDto) {}
