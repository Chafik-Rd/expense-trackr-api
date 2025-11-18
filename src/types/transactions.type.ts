import type { GetQueryType } from "./shared.type.js";

export interface TransactionParams {
  transId: string;
}

export type GetTranQueryType = {
  month?: string;
  year?: string;
  category_id?: string;
  account_id?: string;
  type?: "income" | "expense";
} & GetQueryType;
