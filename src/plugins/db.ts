import fp from "fastify-plugin";
import { AppDataSource } from "../data-source.js";
import { User } from "../api/user/user.entity.js";
import { Transactions } from "../api/transactions/transactions.entity.js";

export default fp(async (fastify) => {
  fastify.decorate("db", {
    user: AppDataSource.getRepository(User),
    transactions: AppDataSource.getRepository(Transactions),
  });
});
