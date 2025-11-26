import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatsService {
    constructor(private prisma: PrismaService){}
    newChat(userId: string, name: string){
        
    }
}
