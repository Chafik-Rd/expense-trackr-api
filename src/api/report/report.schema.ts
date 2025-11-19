import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";

const dateStringSchema = zod.string().optional();

// Summary Query Schema
export const summaryQuerySchema = zod.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});
export const summaryQuerySchemaJSON =
  getSchemaWithoutSchemaTag(summaryQuerySchema);

// Export Query Schema
export const exportQuerySchema = zod.object({
  ...summaryQuerySchema.shape,
  format: zod
    .enum(["csv", "json"], {
      message: "Export format must be 'csv' or 'json'.",
    })
    .default("csv"),

  groupBy: zod
    .enum(["category", "none"], {
      message: "Group by must be 'category' or 'none'.",
    })
    .default("none"),
});
export const exportQuerySchemaJSON =
  getSchemaWithoutSchemaTag(exportQuerySchema);
