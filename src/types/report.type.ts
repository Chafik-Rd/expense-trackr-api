import zod from "zod";
import type { exportQuerySchema, summaryQuerySchema } from "../api/report/report.schema.js";

export type SummaryQueryType = zod.infer<typeof summaryQuerySchema>;

export type ExportQueryType = zod.infer<typeof exportQuerySchema>;


export interface ExportResultType {
  content: string;
  contentType: string;
  ExportFormat: string;
}

export interface CsvOptionsType {
  header: string;
  content: string;
}

export interface CategorySummaryType {
  categoryName: string;
  type: "income" | "expense";
  totalAmount: number;
}

export interface OverallSummaryType {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}