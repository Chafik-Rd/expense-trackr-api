import type { Repository } from "typeorm";
import type { User } from "../api/user/user.entity.js";
import type { Transactions } from "../api/transactions/transactions.entity.js";
import type { Account } from "../api/account/account.entity.js";

import zod from "zod";
import type { getQuerySchema } from "../schemas/shared.schema.js";

export interface HttpError extends Error {
  status?: number;
}

declare module "fastify" {
  interface FastifyInstance {
    db: {
      user: Repository<User>;
      transactions: Repository<Transactions>;
      account: Repository<Account>;
    };
  }
}

export type GetQueryType = zod.infer<typeof getQuerySchema>;
