import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./api/user/user.entity.js";
import { Transactions } from "./api/transactions/transactions.entity.js";
import { Account } from "./api/account/account.entity.js";
import { Category } from "./api/category/category.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST!,
  port: 5432,
  username: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  synchronize: true,
  logging: false,
  entities: [User, Transactions, Account, Category],
  migrations: [],
  subscribers: [],
});
