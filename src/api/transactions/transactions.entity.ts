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

  @ManyToMany(() => Category, (category) => category.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @Column({ type: "uuid" })
  account_id!: string;

  @ManyToMany(() => Account, (account) => account.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "account_id" })
  account!: Account;

  @Column({ type: "integer" })
  amount!: number;

  @Column({ type: "varchar", enum: ["income", "expense"] })
  type!: string;

  @Column({ type: "varchar", nullable: true })
  file_image?: string | undefined;

  @Column({ type: "varchar", nullable: true })
  note?: string | undefined;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
