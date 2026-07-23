
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategies';

import { User } from '../users/entities/user.entity';
import { Desk } from '../rooms/entities/desk.entity';

import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [ PassportModule, JwtModule, TypeOrmModule, JwtStrategy ],
  imports:[ 
    ConfigModule,
    TypeOrmModule.forFeature([ User, Desk ]),
    forwardRef(() => UsersModule), //PARA CARGAR MÓDULOS EN PARALELO
    
    PassportModule.register({defaultStrategy: 'jwt'}) ,
    JwtModule.registerAsync({
      imports:[ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService : ConfigService) => {
        return { 
          secret: configService.get('JWT_SECRET'),
          signOptions: {expiresIn: '10h'}
        }
     }
  }),
  ],
})

export class AuthModule {}
