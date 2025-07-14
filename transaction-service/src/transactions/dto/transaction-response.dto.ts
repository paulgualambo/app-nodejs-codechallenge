// src/transactions/dto/transaction-response.dto.ts

// Clase para el objeto anidado transactionType
class TransactionTypeDto {
  name: string;
}

// Clase para el objeto anidado transactionStatus
class TransactionStatusDto {
  name: string;
}

// Clase principal para la respuesta completa
export class TransactionResponseDto {
  transactionExternalId: string;
  transactionType: TransactionTypeDto;
  transactionStatus: TransactionStatusDto;
  value: number;
  createdAt: Date;
}
