import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";

// Login user
export const loginUserSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
export const loginUserSchemaJSON = getSchemaWithoutSchemaTag(loginUserSchema);

// Create user
export const createUserSchema = zod.object({
  ...loginUserSchema.shape,
  firstName: zod.string(),
  lastName: zod.string(),
});
export const createUserSchemaJSON = getSchemaWithoutSchemaTag(createUserSchema);

// Edit user
const editUserSchema = createUserSchema.partial();
export const editUserSchemaJSON = getSchemaWithoutSchemaTag(editUserSchema);
