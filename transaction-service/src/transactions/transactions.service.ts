import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { getTransactionTypeName } from './enums/transfer-type.enum';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) { }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('transaction-created');
    await this.kafkaClient.connect();
  }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      account_external_id_debit: createTransactionDto.accountExternalIdDebit,
      account_external_id_credit: createTransactionDto.accountExternalIdCredit,
      transfer_type_id: createTransactionDto.tranferTypeId,
      value: createTransactionDto.value,
      status: 'pending', // Estado inicial
    });

    // 1. Guardar la transacción en la BD con estado 'pending'
    const savedTransaction = await this.transactionRepository.save(newTransaction);
    console.log('Transacción guardada:', savedTransaction);

    this.kafkaClient.emit(
      'transaction-created',      // <-- Nombre del Topic
      JSON.stringify(savedTransaction) // <-- Mensaje (la transacción guardada)
    );
    console.log(`Evento enviado a Kafka para la transacción: ${savedTransaction.transaction_external_id}`);

    return savedTransaction;
  }

  async updateStatus(transactionExternalId: string, status: string) {
    try {
      await this.transactionRepository.update(
        { transaction_external_id: transactionExternalId }, // Criterio de búsqueda
        { status: status }, // Campo a actualizar
      );
      console.log(`[OK] Transacción ${transactionExternalId} actualizada a: ${status}`);
    } catch (error) {
      console.error(`[ERROR] al actualizar la transacción ${transactionExternalId}:`, error);
    }
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOneBy({
      transaction_external_id: id,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const response: TransactionResponseDto = {
      transactionExternalId: transaction.transaction_external_id,
      transactionType: {
        name: getTransactionTypeName(transaction.transfer_type_id),
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: Number(transaction.value), // Aseguramos que sea número
      createdAt: transaction.created_at,
    };

    return response;
  }
}
