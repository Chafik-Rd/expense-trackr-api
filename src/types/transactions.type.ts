import zod from "zod";
import type {
  exportTransQuerySchema,
  getTranQuerySchema,
} from "../api/transactions/transactions.schema.js";

export type ExportTransQueryType = zod.infer<typeof exportTransQuerySchema>;
export type GetTranQueryType = zod.infer<typeof getTranQuerySchema>;
export interface TransactionParams {
  transId: string;
}
