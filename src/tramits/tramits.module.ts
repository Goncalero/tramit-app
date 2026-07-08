import { Module } from '@nestjs/common';
import { TramitsService } from './tramits.service';
import { TramitsController } from './tramits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tramit } from './entities/tramit.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([ Tramit ]) ],
  controllers: [TramitsController],
  providers: [TramitsService],
})
export class TramitsModule {}
