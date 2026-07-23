import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';


@Module({
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ 
    PassportModule,
    TypeOrmModule.forFeature([ User ]),
    forwardRef(() => AuthModule),
  ],  
})
export class UsersModule {}
