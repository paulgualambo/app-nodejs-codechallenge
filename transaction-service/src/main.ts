// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve campos que no están en el DTO
    forbidNonWhitelisted: true, // Lanza error si se envían campos no permitidos
  }));

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transaction-status-consumer', // Un groupId diferente
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
