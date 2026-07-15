import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';

import { CreateLoginUserDto } from './dto/create-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
