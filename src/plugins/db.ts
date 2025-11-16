import fp from "fastify-plugin";
import { AppDataSource } from "../data-source.js";
import { User } from "../api/user/user.entity.js";

export default fp(async (fastify) => {
  fastify.decorate("db", {
    user: AppDataSource.getRepository(User),
    // product: AppDataSource.getRepository(Product),
  });
});
