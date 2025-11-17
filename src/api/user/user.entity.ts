import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { Transactions } from "../transactions/transactions.entity.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  firstName!: string;

  @Column({ type: "varchar" })
  lastName!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @CreateDateColumn({ type: "timestamptz" })
  updated_at!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Transactions, (transaction) => transaction.user)
  transactions!: Transactions;
}
