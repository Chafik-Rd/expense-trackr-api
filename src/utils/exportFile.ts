import type { HttpError } from "../types/fastify.type.js";
import type { CsvOptionsType, ExportResultType } from "../types/report.type.js";

// Define supported formats as constants
const ExportFormats = {
  JSON: "json",
  CSV: "csv",
} as const;


type ExportFormatType = (typeof ExportFormats)[keyof typeof ExportFormats];

const contentType = {
  JSON: "application/json",
  CSV: "text/csv; charset=utf-8",
} as const;

// Export data to JSON format
const exportToJson = (data: unknown): ExportResultType => {
  return {
    content: JSON.stringify(data, null, 2),
    contentType: contentType.JSON,
    ExportFormat: ExportFormats.JSON
  };
};

// Export data to CSV format
const exportToCsv = (options: CsvOptionsType): ExportResultType => {
  const { header, content } = options;

  // Validate CSV options
  if (!header || !content) {
    const error = new Error(
      "Both header and content are required for CSV export"
    ) as HttpError;
    error.status = 400;
    throw error;
  }

  return {
    content: `${header}${content}`,
    contentType: contentType.CSV,
    ExportFormat: ExportFormats.CSV
  };
};

export const exportFile = (
  format: string,
  data: unknown,
  csvOptions?: CsvOptionsType
) => {
  const normalizedFormat = format?.toLowerCase().trim() as ExportFormatType;

  // Check format
  if (!Object.values(ExportFormats).includes(normalizedFormat)) {
    const error: HttpError = new Error(
      `Unsupported export format: ${format}. Supported formats: ${Object.values(
        ExportFormats
      ).join(",")}`
    );
    error.status = 400;
    throw error;
  }

  switch (normalizedFormat) {
    case ExportFormats.JSON:
      return exportToJson(data);
    case ExportFormats.CSV:
      if (!csvOptions) {
        const error: HttpError = new Error(
          "CSV options (header and content) are required for CSV export"
        );
        error.status = 400;
        throw error;
      }
      return exportToCsv(csvOptions);
    default:
      // TypeScript exhaustiveness check
      const _exhaustive: never = normalizedFormat;
      throw new Error(`Unhandled format: ${_exhaustive}`);
  }
};
