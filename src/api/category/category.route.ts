import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authUser } from "../../middleware/authUser.js";
import {
  categoryIdParamSchema,
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

export const categoryRoutes = (
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

  //Edit category
  fastify.patch("/:categoryId", {
    schema: {
      params: categoryIdParamSchema,
      body: editCategorySchemaJSON,
    },
    handler: editCategory,
  });

  // Get category
  fastify.get("/", {
    schema: {
      querystring: getQuerySchemaJSON,
    },
    handler: getCategory,
  });

  // Delete category
  fastify.delete("/:categoryId", {
    schema: {
      params: categoryIdParamSchema,
    },
    handler: deleteCategory,
  });
};
