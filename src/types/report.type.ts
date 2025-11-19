export interface SummaryQueryType {
  startDate?: string;
  endDate?: string;
}

export interface ExportQueryType extends SummaryQueryType {
  format: "csv" | "json";
  groupBy?: "category" | "none";
}

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