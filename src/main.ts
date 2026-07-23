import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  


app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }),
);

/*
 ESTO TIENE QUE COLOCARSE AQUI SIEMPREEEEE, SINO NO HACE LAS
 COMPROBACIONES EN LOS  @IsEmail @IS Y TODO LO DE LOS DTO 
*/
await app.listen(process.env.PORT ?? 3000);
                                                                                          
}

bootstrap();
