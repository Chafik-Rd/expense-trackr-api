import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Column({ type: "varchar" })
  category_id!: string;

  @Column({ type: "integer" })
  amount!: number;

  @Column({ type: "varchar", nullable: true })
  file_image?: string | undefined;

  @Column({ type: "varchar", nullable: true })
  note?: string | undefined;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;

  @CreateDateColumn({ type: "timestamptz" })
  updated_at!: Date;
}
