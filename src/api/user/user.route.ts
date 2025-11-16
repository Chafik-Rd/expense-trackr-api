import { type FastifyInstance, type FastifyPluginOptions } from "fastify";
import { createUser, getUserProfile } from "./user.controller.js";
import { CreateUserSchemaJSON } from "./user.schema.js";

const userRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post("/signup", {
    schema: {
      body: CreateUserSchemaJSON,
    },
    handler: createUser,
  });

  fastify.get("/profile", getUserProfile);
};
export default userRoutes;
