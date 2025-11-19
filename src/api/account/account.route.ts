import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authUser } from "../../middleware/authUser.js";
import {
  createAccount,
  deleteAccount,
  editAccount,
  getAccount,
} from "./account.controller.js";
import {
  accountIdParamSchema,
  createAccountSchemaJSON,
  editAccountSchemaJSON,
} from "./account.schema.js";
import { getQuerySchemaJSON } from "../../schemas/shared.schema.js";

const accountRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Create account
  fastify.post("/", {
    schema: {
      body: createAccountSchemaJSON,
    },
    handler: createAccount,
  });

  //Edit account
  fastify.patch("/:accountId", {
    schema: {
      params: accountIdParamSchema,
      body: editAccountSchemaJSON,
    },
    handler: editAccount,
  });

  // Get account
  fastify.get("/", {
    schema: {
      querystring: getQuerySchemaJSON,
    },
    handler: getAccount,
  });

  // Delete account
  fastify.delete("/:accountId", {
    schema: {
      params: accountIdParamSchema,
    },
    handler: deleteAccount,
  });
};
export default accountRoutes;
