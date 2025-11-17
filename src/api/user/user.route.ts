import { type FastifyInstance, type FastifyPluginOptions } from "fastify";
import { createUser, getUserProfile } from "./user.controller.js";
import { createUserSchemaJSON } from "./user.schema.js";

const userRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post("/signup", {
    schema: {
      body: createUserSchemaJSON,
    },
    handler: createUser,
  });

  fastify.get("/profile", getUserProfile);
};
export default userRoutes;
