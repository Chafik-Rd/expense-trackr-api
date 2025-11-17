import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authUser } from "../../middleware/authUser.js";
import {
  createAccount,
  deleteAccount,
  editAccount,
  getAccount,
} from "./account.controller.js";
import {
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
  fastify.delete("/:accountId", deleteAccount);
};
export default accountRoutes;
