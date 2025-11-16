import type { FastifyReply, FastifyRequest } from "fastify";
import type { HttpError } from "../types/fastify.type.js";

export const centralizedError = (
  err: HttpError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  console.error(err.stack);
  reply.code(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
