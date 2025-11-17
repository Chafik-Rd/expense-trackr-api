import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { createTransaction, deleteTransaction } from "./transactions.controller.js";
import { authUser } from "../../middleware/authUser.js";

const transactionRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Create transaction
  fastify.post("/", {
    handler: createTransaction,
  });

  // Delete transaction
  fastify.delete("/:transId", {
    handler: deleteTransaction,
  });
};
export default transactionRoutes;
