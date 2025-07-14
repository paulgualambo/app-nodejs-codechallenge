// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Usa el nombre del servicio de Docker
      },
      consumer: {
        groupId: 'anti-fraud-consumer', // ID único para el grupo de consumidores
      },
    },
  });
  await app.listen();
  console.log('Anti-fraud microservice is listening for Kafka events...');
}
bootstrap();
