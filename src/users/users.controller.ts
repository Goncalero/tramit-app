import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 
  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.usersService.findAllUsers(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.usersService.findOneUser(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOneUser(term, updateUserDto);
  }

  @Patch('change-role/:term')
  @Auth( ValidRoles.superUser)
  changeRole(
    @Param('term') term: string, @Body('roles') roles: ValidRoles[]
  ){
    return this.usersService.changeRoleUser(term, roles)
  }

  @Patch('reset-password/:term')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  resetPassword(@Param('term') term: string, @Body('newPassword') newPassword:string){
    return this.usersService.resetPasswordUser(term, newPassword)
  }
  
  
  @Patch('isInactive/:term')
  desactivateUser(@Param('term') term: string ){
    return this.usersService.inactiveUser(term);
  }

  @Patch('isActive/:term')
  activateUser(@Param('term') term: string, @Body('deskId') deskId: string ) {
    return this.usersService.activeUser(term, deskId);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.usersService.removeUser(term);
  }
}
