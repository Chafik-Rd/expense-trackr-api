import { type FastifyInstance, type FastifyPluginOptions } from "fastify";
import {
  createUser,
  EditUserProfile,
  getUserProfile,
  loginUser,
} from "./user.controller.js";
import {
  createUserSchemaJSON,
  editUserSchemaJSON,
  loginUserSchemaJSON,
} from "./user.schema.js";
import { authUser } from "../../middleware/authUser.js";

const userRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // sign-up
  fastify.post("/signup", {
    schema: {
      body: createUserSchemaJSON,
    },
    handler: createUser,
  });

  // sign-in
  fastify.post("/signin", {
    schema: {
      body: loginUserSchemaJSON,
    },
    handler: loginUser,
  });

  // get profile
  fastify.get("/profile", { preHandler: [authUser], handler: getUserProfile });

  // edit profile
  fastify.patch("/profile", {
    preHandler: [authUser],
    schema: {
      body: editUserSchemaJSON,
    },
    handler: EditUserProfile,
  });
};
export default userRoutes;
