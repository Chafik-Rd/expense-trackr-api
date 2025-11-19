import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";

// Create category
export const createCategorySchema = zod.object({
  name: zod.string().min(1, "Name is required").max(50, "Name is too long"),
  type: zod.enum(["income", "expense"]),
});
export const createCategorySchemaJSON =
  getSchemaWithoutSchemaTag(createCategorySchema);

// Edit category
const editCategorySchema = createCategorySchema.partial();
export const editCategorySchemaJSON =
  getSchemaWithoutSchemaTag(editCategorySchema);

// Param category Schema
export const categoryIdParamSchema = {
  type: "object",
  properties: {
    categoryId: {
      type: "string",
      format: "uuid",
      description: "Category ID (UUID) to be deleted",
    },
    additionalProperties: false,
  },
};
