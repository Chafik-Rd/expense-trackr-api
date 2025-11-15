import type { FastifyReply, FastifyRequest } from "fastify";
import type { HttpError } from "../types/fastify.type.js";

export const centralizedError = (
  error: HttpError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  console.error(error.stack);
  reply.code(error.status || 500).send({
    success: false,
    message: error.message || "Internal Server Error",
  });
};
