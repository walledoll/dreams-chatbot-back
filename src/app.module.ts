import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DreamService } from './dream/dream.service';
import { DreamModule } from './dream/dream.module';
import { DreamsModule } from './dreams/dreams.module';
import { UsersModule } from './users/users.module';
import { DreamModule } from './dream/dream.module';

@Module({
  imports: [DreamModule, UsersModule, DreamsModule],
  controllers: [AppController],
  providers: [AppService, DreamService],
})
export class AppModule {}
