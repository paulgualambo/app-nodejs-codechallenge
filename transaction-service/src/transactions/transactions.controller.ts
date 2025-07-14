import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.create(createTransactionDto);
  }

  @EventPattern('transaction-validated')
  handleTransactionValidated(@Payload() message: any) {
    console.log(message)
    console.log('Resultado de validación recibido:', message.status);

    this.transactionsService.updateStatus(
      message.transactionExternalId,
      message.status,
    );
  }

  @Get(':transactionExternalId')
  findOne(
    @Param('transactionExternalId', ParseUUIDPipe) transactionExternalId: string,
  ): Promise<TransactionResponseDto> {
    return this.transactionsService.findOne(transactionExternalId);
  }
}
