// websocket.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class WebSocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
      },
      // Важные настройки для совместимости
      allowEIO3: true, // Разрешить Socket.IO v3 клиенты
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });
    
    return server;
  }
}