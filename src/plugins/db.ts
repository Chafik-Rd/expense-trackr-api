import fp from "fastify-plugin";
import { AppDataSource } from "../data-source.js";
import { User } from "../api/user/user.entity.js";
import { Transactions } from "../api/transactions/transactions.entity.js";
import { Account } from "../api/account/account.entity.js";
import { Category } from "../api/category/category.entity.js";

export default fp(async (fastify) => {
  fastify.decorate("db", {
    user: AppDataSource.getRepository(User),
    transactions: AppDataSource.getRepository(Transactions),
    account: AppDataSource.getRepository(Account),
    category: AppDataSource.getRepository(Category),
  });
});
