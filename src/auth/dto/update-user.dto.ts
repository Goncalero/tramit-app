import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginUserDto } from './create-user.dto';



export class UpdateLoginUserDto extends PartialType(CreateLoginUserDto) {}
