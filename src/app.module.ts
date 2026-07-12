import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { RoomsModule } from './rooms/rooms.module';
import { TramitsModule } from './tramits/tramits.module';
import { UsersModule } from './users/users.module';



@Module({
  imports: [
    ConfigModule.forRoot(),

   TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    AppointmentsModule,
    AuthModule,
    RoomsModule,
    TramitsModule,
    UsersModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
