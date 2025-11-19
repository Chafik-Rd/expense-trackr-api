import type { FastifyReply, FastifyRequest } from "fastify";
import type { HttpError } from "../types/fastify.type.js";
import { ZodError } from "zod";

export const centralizedError = (
  err: HttpError | ZodError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
    reply.code(400).send({
      success: false,
      message: "Validation failed. Please check the provided data.",
      errors: formattedErrors, // Array ของ Error ที่อ่านง่าย
    });
    return;
  }
  console.error(err.stack);
  reply.code(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
