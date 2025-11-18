import type { DataSource, Repository } from "typeorm";
import type { User } from "../api/user/user.entity.js";
import type { Transactions } from "../api/transactions/transactions.entity.js";
import type { Account } from "../api/account/account.entity.js";
import type { Category } from "../api/category/category.entity.js";

export interface HttpError extends Error {
  status?: number;
}

declare module "fastify" {
  interface FastifyInstance {
    db: {
      dataSource: DataSource;
      user: Repository<User>;
      transactions: Repository<Transactions>;
      account: Repository<Account>;
      category: Repository<Category>;
    };
  }
}
