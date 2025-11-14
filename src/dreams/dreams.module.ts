import { Module } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { DreamsController } from './dreams.controller';

@Module({
  controllers: [DreamsController],
  providers: [DreamsService],
})
export class DreamsModule {}
