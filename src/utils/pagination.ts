import type { PaginationResult } from "../types/pagination.type.js";

export const createUrl = (offsetValue: number, limitValue: number): string => {
  return `?offset=${offsetValue}&limit=${limitValue}`;
};

export const createPaginationMeta = (
  total: number,
  page: number,
  limit: number,
  skip: number
): PaginationResult => {
  const totalPages = Math.ceil(total / limit);

  let nextUrl: string | null = null;
  let prevUrl: string | null = null;

  // Next URL
  if (page < totalPages) {
    const nextOffset = page * limit;
    nextUrl = createUrl(nextOffset, limit);
  }

  // Previous URL
  if (page > 1) {
    const prevOffset = skip - limit;
    prevUrl = createUrl(prevOffset, limit);
  }

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
      next: nextUrl,
      previous: prevUrl,
    },
  };
};
