import { Controller, Post, Body, UseGuards, Get, Patch, Param } from '@nestjs/common';

import { CreateLoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService : UsersService, 
    private readonly authService: AuthService
  ) {}


  @Post('login')
  createLogin(@Body() createAuthDto: CreateLoginUserDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(){
    return {
      ok: true,
      message: 'esta es una ruta privada'
    }
  }

}
