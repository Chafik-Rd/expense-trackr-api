import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import type { HttpError } from "../types/fastify.type.js";
import type { JwtError, UserTokenPayload } from "../types/user.type.js";

// Middleware to authenticate user using JWT
export const authUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.cookies?.accessToken;

  //   const tokenHeader = req.headers?.authorization.split(" ")[1];

  if (!token) {
    const error: HttpError = new Error("Authentication token missing!");
    error.status = 401;
    throw error;
  }
  try {
    const decoded_token = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as UserTokenPayload;
    req.user = { id: decoded_token.userId };
  } catch (err) {
    const error = err as JwtError;
    const isExpired = error.name === "TokenExpiredError";

    reply.code(401).send({
      success: false,
      code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: isExpired
        ? "Token has expired, please log in again."
        : "Invalid token.",
    });
  }
};
