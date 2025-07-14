// src/app.controller.ts
import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {

  constructor(
    // Inyectar el cliente de Kafka
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly client: ClientKafka,
  ) { }

  async onModuleInit() {
    // Conectar al broker cuando el servicio se inicia
    await this.client.connect();
  }

  // Escucha el topic 'transaction-created'
  @EventPattern('transaction-created')
  handleTransactionCreated(@Payload() message: any) {
    console.log('Evento de Kafka recibido en topic "transaction-created":');
    console.log(message.value); // El contenido del mensaje de Kafka

    const transaction = message.value;
    const status = message.value > 1000 ? 'rejected' : 'approved';

    console.log(`Transacción ${message.transaction_external_id} validada con estado: ${status}`);

    const result = {
      transactionExternalId: message.transaction_external_id,
      status: status,
    }
    this.client.emit(
      'transaction-validated', // Nombre del nuevo topic
      JSON.stringify(result),
    );

  }
}
