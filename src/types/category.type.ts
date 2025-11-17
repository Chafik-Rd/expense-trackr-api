import zod from "zod";
import type { createCategorySchema } from "../api/category/category.schema.js";

export type CategoryType = zod.infer<typeof createCategorySchema>;

export interface CategoryParams {
  categoryId: string;
}
