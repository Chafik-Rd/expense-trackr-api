import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransaction,
  getTransactionExport,
} from "./transactions.controller.js";
import { authUser } from "../../middleware/authUser.js";
import { getQuerySchemaJSON } from "../../schemas/shared.schema.js";

const transactionRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Create transaction
  fastify.post("/", createTransaction);

  // Edit transaction
  fastify.patch("/", editTransaction);

  // Delete transaction
  fastify.delete("/:transId", deleteTransaction);

  // Get transaction
  fastify.get("/", {
    schema: {
      querystring: getQuerySchemaJSON,
    },
    handler: getTransaction,
  });
  // Get transaction
  fastify.get("/export", {
    schema: {
      querystring: getQuerySchemaJSON,
    },
    handler: getTransactionExport,
  });
};
export default transactionRoutes;
