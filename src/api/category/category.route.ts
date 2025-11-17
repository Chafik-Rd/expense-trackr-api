import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authUser } from "../../middleware/authUser.js";
import {
  createCategorySchemaJSON,
  editCategorySchemaJSON,
} from "./category.schema.js";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategory,
} from "./category.controller.js";
import { getQuerySchemaJSON } from "../../schemas/shared.schema.js";

const categoryRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Create category
  fastify.post("/", {
    schema: {
      body: createCategorySchemaJSON,
    },
    handler: createCategory,
  });

  //Edit account
  fastify.patch("/:accountId", {
    schema: {
      body: editCategorySchemaJSON,
    },
    handler: editCategory,
  });

  // Get account
  fastify.get("/", {
    schema: {
      querystring: getQuerySchemaJSON,
    },
    handler: getCategory,
  });

  // Delete account
  fastify.delete("/:categoryId", deleteCategory);
};
