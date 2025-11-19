import type { HttpError } from "../types/fastify.type.js";

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isValidDateString = (dateString?: string): boolean => {
  if (!dateString) return true;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const getExportDateRange = (startDate?: string, endDate?: string) => {
  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    const error: HttpError = new Error(
      "Invalid date format. Please use ISO format (YYYY-MM-DD)."
    );
    error.status = 400;
    throw error;
  }
  const now = new Date();

  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const end = endDate ? new Date(endDate) : defaultEnd;

  const defaultStart = new Date(end.getFullYear(), end.getMonth(), 1);
  const start = startDate ? new Date(startDate) : defaultStart;

  const endFilter = new Date(end);
  endFilter.setDate(endFilter.getDate() + 1);

  return { start, end, endFilter };
};

export interface DateRangeType {
  start: Date;
  end: Date;
  endFilter: Date;
}