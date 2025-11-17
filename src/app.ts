import fastify from "fastify";
import dotenv from "dotenv";

import { centralizedError } from "./middleware/centralizedError.js";
import dbPlugin from "./plugins/db.js";
import userRoutes from "./api/user/user.route.js";
import transactionRoutes from "./api/transactions/transactions.route.js";
import fastifyMultipart from "@fastify/multipart";
import cookie from "@fastify/cookie";

// Load environment variables from .env file
dotenv.config();

const app = fastify({
  logger: true,
});

app.register(dbPlugin);
app.register(cookie);
app.register(fastifyMultipart, {
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
    files: 1,
  },
  attachFieldsToBody: true,
});

// API Routes
app.register(
  (instance) => {
    instance.register(userRoutes, { prefix: "/user" });
    instance.register(transactionRoutes, { prefix: "/transaction" });
  },
  { prefix: "/api/v1" }
);
// Centralized Error Handling Middleware
app.setErrorHandler(centralizedError);

export { app };
