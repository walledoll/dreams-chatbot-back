import { Module } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { DreamsController } from './dreams.controller';
import { AiService } from 'src/ai/ai.service';

@Module({
  controllers: [DreamsController],
  providers: [DreamsService],
  imports: [AiService]
})
export class DreamsModule {}
