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
  // Sign-up
  fastify.post("/signup", {
    schema: {
      tags: ["user"],
      body: createUserSchemaJSON,
    },
    handler: createUser,
  });

  // Sign-in
  fastify.post("/signin", {
    schema: {
      tags: ["user"],
      body: loginUserSchemaJSON,
    },
    handler: loginUser,
  });

  // Get profile
  fastify.get("/profile", {
    preHandler: [authUser],
    schema: {
      tags: ["user"],
      security: [
        {
          cookieAuth: [],
        },
      ],
    },
    handler: getUserProfile,
  });

  // Edit profile
  fastify.patch("/profile", {
    preHandler: [authUser],
    schema: {
      tags: ["user"],
      security: [
        {
          cookieAuth: [],
        },
      ],
      body: editUserSchemaJSON,
    },
    handler: EditUserProfile,
  });
};
export default userRoutes;
