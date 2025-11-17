import zod from "zod";
import type { JwtPayload } from "jsonwebtoken";
import type {
  createUserSchema,
  loginUserSchema,
} from "../api/user/user.schema.js";

export type UserLoginType = zod.infer<typeof loginUserSchema>;

export type UserType = zod.infer<typeof createUserSchema>;

export interface UserTokenPayload extends JwtPayload {
  userId: string;
}

export interface JwtError extends Error {
  name: "TokenExpiredError" | "JsonWebTokenError" | "NotBeforeError";
}
