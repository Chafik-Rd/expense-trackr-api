import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";

// Create account
export const createAccountSchema = zod.object({
  name: zod.string(),
  initial_balance: zod.number(),
  current_balance: zod.number(),
  is_active: zod.boolean().default(true).optional(),
});
export const createAccountSchemaJSON =
  getSchemaWithoutSchemaTag(createAccountSchema);

// Edit account
const editAccountSchema = createAccountSchema.partial();
export const editAccountSchemaJSON =
  getSchemaWithoutSchemaTag(editAccountSchema);
