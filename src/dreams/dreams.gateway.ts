import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/create-dream.dto';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class DreamGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly dreamService: DreamsService) {}

  @SubscribeMessage('new_dream')
  async handleNewDream(
    @MessageBody() payload: { userId: string; dreamText: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, dreamText } = payload;

    if (!userId || !dreamText?.trim()) {
      client.emit('error', { message: 'userId и dreamText обязательны' });
      return;
    }

    try {
      // Уведомляем клиента: началась генерация
      client.emit('interpretation_start');

      // Генерируем интерпретацию потоком
      const stream = await this.dreamService.streamInterpretation(userId, dreamText);

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        // Отправляем часть ответа
        client.emit('interpretation_chunk', { text: chunk, isFinal: false });
      }

      // Сохраняем полный сон в БД
      await this.dreamService.create({interpretation: fullResponse, dreamText}, userId);

      // Финал
      client.emit('interpretation_chunk', { text: '', isFinal: true });
      client.emit('dream_saved', { success: true });
    } catch (error) {
      console.error('Gateway error:', error);
      client.emit('error', { message: error.message || 'Ошибка обработки сна' });
    }
  }
}