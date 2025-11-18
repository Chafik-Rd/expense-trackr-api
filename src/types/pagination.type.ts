export interface PaginationResult {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    next: string | null;
    previous: string | null;
  };
}
