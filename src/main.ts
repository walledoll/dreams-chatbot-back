import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { WebSocketAdapter } from './websocket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  
  
  // Enhanced CORS configuration for WebSockets
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  });
  
  // Use custom WebSocket adapter
  app.useWebSocketAdapter(new WebSocketAdapter(app));
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  const config = new DocumentBuilder()
    .setTitle('Chatbot api demo')
    .setDescription('API description')
    .setVersion('0.1')
    .addTag('')
    .build();
  
  app.use(cookieParser());
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('Using JWT secret:', process.env.JWT_SECRET);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();