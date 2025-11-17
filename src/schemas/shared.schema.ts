import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../utils/schema.js";

// Get Query
export const getQuerySchema = zod.object({
  page: zod.coerce.number().min(1).default(1),
  limit: zod.coerce.number().min(1).max(100).default(10),
});
export const getQuerySchemaJSON = getSchemaWithoutSchemaTag(getQuerySchema);
