import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { AiService } from './ai/ai.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DreamsModule } from './dreams/dreams.module';
import { DreamsService } from './dreams/dreams.service';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DreamGateway } from './dreams/dreams.gateway';


@Module({
  imports: [UsersModule, DreamsModule, AuthModule, AiModule, PrismaModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService, DreamsService, AiService, PrismaService, ConfigService, DreamGateway],
})
export class AppModule {}
