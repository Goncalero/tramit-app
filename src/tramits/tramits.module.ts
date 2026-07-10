import { Module } from '@nestjs/common';
import { TramitsService } from './tramits.service';
import { TramitsController } from './tramits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tramit } from './entities/tramit.entity';

@Module({
 
  controllers: [TramitsController],
  providers: [TramitsService],
  imports:[ TypeOrmModule.forFeature([ Tramit ])],
  exports: [TypeOrmModule]
})
export class TramitsModule {}
