import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity.js";
import { Transactions } from "../transactions/transactions.entity.js";

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.account, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  initial_balance!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  current_balance!: number;

  @Column({ type: "boolean" })
  is_active!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;

  @OneToMany(() => Transactions, (transactions) => transactions.account)
  transactions!: Transactions;
}
