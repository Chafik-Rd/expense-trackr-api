import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransaction,
  getTransactionExport,
} from "./transactions.controller.js";
import { authUser } from "../../middleware/authUser.js";
import { exportTransQuerySchemaJSON, getTranQuerySchemaJSON, transactionIdParamSchema } from "./transactions.schema.js";

const transactionRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Create transaction
  fastify.post("/", createTransaction);

  // Edit transaction
  fastify.patch("/:transId", {
    schema: {
      params: transactionIdParamSchema,
    },
    handler: editTransaction,
  });

  // Delete transaction
  fastify.delete("/:transId", {
    schema: {
      params: transactionIdParamSchema,
    },
    handler: deleteTransaction,
  });

  // Get transaction
  fastify.get("/", {
    schema: {
      querystring: getTranQuerySchemaJSON,
    },
    handler: getTransaction,
  });
  // Get transaction
  fastify.get("/export", {
    schema: {
      querystring: exportTransQuerySchemaJSON,
    },
    handler: getTransactionExport,
  });
};
export default transactionRoutes;
