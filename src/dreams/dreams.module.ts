import { Module } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { DreamsController } from './dreams.controller';
import { AiService } from 'src/ai/ai.service';
import { AiModule } from 'src/ai/ai.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DreamsController],
  providers: [DreamsService, JwtService],
  imports: [AiModule],
})
export class DreamsModule {}
