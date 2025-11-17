import type { FastifyRequest } from "fastify";
import type { JwtPayload } from "jsonwebtoken";

export interface UserLoingType {
  email: string;
  password: string;
}
export interface UserType extends UserLoingType {
  firstName: string;
  lastName: string;
}

export interface UserTokenPayload extends JwtPayload {
  userId: string;
}

export interface JwtError extends Error {
    name: "TokenExpiredError" | "JsonWebTokenError" | "NotBeforeError";
}