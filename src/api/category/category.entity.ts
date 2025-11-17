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
import type { TypeEnum } from "../../types/shared.type.js";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.category, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", enum: ["income", "expense"] })
  type!: TypeEnum;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;

  @OneToMany(() => Transactions, (transactions) => transactions.category)
  transactions!: Transactions;
}
