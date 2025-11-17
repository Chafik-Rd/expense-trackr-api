import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../../utils/zodSchema.js";

// Create user
const createUserSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});
export const createUserSchemaJSON = getSchemaWithoutSchemaTag(createUserSchema);

// Login user
const loginUserSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
export const loginUserSchemaJSON = getSchemaWithoutSchemaTag(loginUserSchema);

// Edit user
const editUserSchema = createUserSchema.partial();
export const editUserSchemaJSON = getSchemaWithoutSchemaTag(editUserSchema);
