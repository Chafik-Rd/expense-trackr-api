import fastify from "fastify";
import dotenv from "dotenv";

import { centralizedError } from "./middleware/centralizedError.js";
import dbPlugin from "./plugins/db.js";
import fastifyMultipart from "@fastify/multipart";
import cookie from "@fastify/cookie";
import userRoutes from "./api/user/user.route.js";
import transactionRoutes from "./api/transactions/transactions.route.js";
import accountRoutes from "./api/account/account.route.js";
import { categoryRoutes } from "./api/category/category.route.js";
import { reportRoutes } from "./api/report/report.route.js";

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
    instance.register(accountRoutes, { prefix: "/account" });
    instance.register(categoryRoutes, { prefix: "/category" });
    instance.register(reportRoutes, { prefix: "/report" });
  },
  { prefix: "/api/v1" }
);
// Centralized Error Handling Middleware
app.setErrorHandler(centralizedError);

export { app };
