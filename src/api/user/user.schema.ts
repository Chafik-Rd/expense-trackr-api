import zod from "zod";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";

// Login user
export const loginUserSchema = zod.object({
  email: zod.string().email().max(255, "Email cannot exceed 255 characters."),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, "Password cannot exceed 64 characters."),
});
export const loginUserSchemaJSON = getSchemaWithoutSchemaTag(loginUserSchema);

// Create user
export const createUserSchema = zod.object({
  ...loginUserSchema.shape,
  firstName: zod
    .string()
    .min(1, "First name is required.")
    .max(50, "First name cannot exceed 50 characters."),
  lastName: zod
    .string()
    .min(1, "Last name is required.")
    .max(50, "Last name cannot exceed 50 characters."),
});
export const createUserSchemaJSON = getSchemaWithoutSchemaTag(createUserSchema);

// Edit user
const baseEditSchema = createUserSchema.omit({
  email: true, // ตัด 'email' ออกไป
});
export const editUserSchema = baseEditSchema.partial();
export const editUserSchemaJSON = getSchemaWithoutSchemaTag(editUserSchema);
