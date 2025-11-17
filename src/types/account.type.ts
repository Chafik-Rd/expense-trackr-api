import zod from "zod";
import type { createAccountSchema } from "../api/account/account.schema.js";

export type AccountType = zod.infer<typeof createAccountSchema>;

export interface AccountParams {
  accountId: string;
}
