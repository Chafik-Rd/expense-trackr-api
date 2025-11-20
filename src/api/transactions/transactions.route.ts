import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransaction,
  getTransactionExport,
} from "./transactions.controller.js";
import { authUser } from "../../middleware/authUser.js";
import {
  CreateTranMultipartDocSchema,
  exportTransQuerySchemaJSON,
  getTranQuerySchemaJSON,
  transactionIdParamSchema,
} from "./transactions.schema.js";
interface JsonSchemaBody {
  type?: string;
  properties?: Record<string, any>;
  required?: string[];
}
const transactionRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Create transaction
  fastify.post("/", {
    schema: {
      tags: ["transaction"],
      security: [
        {
          cookieAuth: [],
        },
      ],
    },
    handler: createTransaction,
  });

  // Edit transaction
  fastify.patch("/:transId", {
    schema: {
      tags: ["transaction"],
      security: [
        {
          cookieAuth: [],
        },
      ],
      params: transactionIdParamSchema,
    },
    handler: editTransaction,
  });

  // Delete transaction
  fastify.delete("/:transId", {
    schema: {
      tags: ["transaction"],
      security: [
        {
          cookieAuth: [],
        },
      ],
      params: transactionIdParamSchema,
    },
    handler: deleteTransaction,
  });

  // Get transaction
  fastify.get("/", {
    schema: {
      tags: ["transaction"],
      security: [
        {
          cookieAuth: [],
        },
      ],
      querystring: getTranQuerySchemaJSON,
    },
    handler: getTransaction,
  });
  // Get transaction
  fastify.get("/export", {
    schema: {
      tags: ["transaction"],
      security: [
        {
          cookieAuth: [],
        },
      ],
      querystring: exportTransQuerySchemaJSON,
    },
    handler: getTransactionExport,
  });
};
export default transactionRoutes;
