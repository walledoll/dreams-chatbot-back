import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { DreamsModule } from 'src/dreams/dreams.module';

@Module({
    providers: [AiService],
    exports: [AiService],
    imports: [ConfigModule]
})
export class AiModule {}
