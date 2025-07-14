// src/transactions/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'transactions' }) // El nombre de la tabla
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  transaction_external_id: string;

  @Column({ type: 'uuid' })
  account_external_id_debit: string;

  @Column({ type: 'uuid' })
  account_external_id_credit: string;

  @Column()
  transfer_type_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
