import zod from "zod";
import type { getQuerySchema } from "../schemas/shared.schema.js";

export type TypeEnum = "income" | "expense";

export type GetQueryType = zod.infer<typeof getQuerySchema>;
