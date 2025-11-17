import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  createTransactionSchemaJSON,
  UploadImageBodySchemaJSON,
} from "./transactions.schema.js";
import {
  createTransaction,
  uploadImageToCloud,
} from "./transactions.controller.js";

const transactionRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post("/", {
    schema: {
      body: createTransactionSchemaJSON,
    },
    handler: createTransaction,
  });
  fastify.post("/upload-image", {
    schema: {
      body: UploadImageBodySchemaJSON,
    },
    handler: uploadImageToCloud,
  });
};
export default transactionRoutes;
