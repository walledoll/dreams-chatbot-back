import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { AiService } from './ai/ai.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DreamsModule } from './dreams/dreams.module';
import { DreamsService } from './dreams/dreams.service';


@Module({
  imports: [UsersModule, DreamsModule, AuthModule, AiModule],
  controllers: [AppController],
  providers: [AppService, DreamsService, AiService],
})
export class AppModule {}
