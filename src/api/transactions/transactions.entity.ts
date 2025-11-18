import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity.js";
import { Account } from "../account/account.entity.js";
import { Category } from "../category/category.entity.js";
import type { TypeEnum } from "../../types/shared.type.js";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "uuid" })
  category_id!: string;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @Column({ type: "uuid" })
  account_id!: string;

  @ManyToOne(() => Account, (account) => account.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @Column({ type: "integer" })
  amount!: number;

  @Column({ type: "varchar", enum: ["income", "expense"] })
  type!: TypeEnum;

  @Column({ type: "varchar", nullable: true })
  file_image?: string | undefined;

  @Column({ type: "varchar", nullable: true })
  note?: string | undefined;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
