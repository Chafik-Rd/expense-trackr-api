import zod from "zod";
import type { JwtPayload } from "jsonwebtoken";
import type {
  createUserSchema,
  editUserSchema,
  loginUserSchema,
} from "../api/user/user.schema.js";

export type UserLoginType = zod.infer<typeof loginUserSchema>;

export type CreateUserType = zod.infer<typeof createUserSchema>;
export type EditUserType = zod.infer<typeof editUserSchema>;

export interface UserTokenPayload extends JwtPayload {
  userId: string;
}

export interface JwtError extends Error {
  name: "TokenExpiredError" | "JsonWebTokenError" | "NotBeforeError";
}
