export interface SummaryQueryType {
  startDate?: string;
  endDate?: string;
}

export interface ExportQueryType extends SummaryQueryType {
  format?: "csv" | "json";
}
