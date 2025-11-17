import type { Repository } from "typeorm";
import type { User } from "../api/user/user.entity.js";
import type { Transactions } from "../api/transactions/transactions.entity.js";

export interface HttpError extends Error {
  status?: number;
}

declare module "fastify" {
  interface FastifyInstance {
    db: {
      user: Repository<User>;
      transactions: Repository<Transactions>;
    };
  }
}
