import fastify from "fastify";
import dotenv from "dotenv";
import fastifyMultipart from "@fastify/multipart";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { centralizedError } from "./middleware/centralizedError.js";
import dbPlugin from "./plugins/db.js";
import userRoutes from "./api/user/user.route.js";
import transactionRoutes from "./api/transactions/transactions.route.js";
import accountRoutes from "./api/account/account.route.js";
import { categoryRoutes } from "./api/category/category.route.js";
import { reportRoutes } from "./api/report/report.route.js";
import { globalRateLimitOptions } from "./middleware/rateLimiter.js";
import { swaggerOptions } from "./plugins/swagger.config.js";

// Load environment variables from .env file
dotenv.config();

const app = fastify({
  logger: true,
});

// Security middleware
app.register(helmet);

// CORS configuration
const corsOption = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
  credentials: true, // ✅ allow cookies to be sent
};
app.register(cors, corsOption);

// Swagger configuration
app.register(fastifySwagger, swaggerOptions);

// Swagger UI (Interactive Web Page)
app.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  // Setting swagger read schema to use zod
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

// Apply rate limiting middleware to all requestsate limite
app.register(rateLimit, globalRateLimitOptions);

// Middleware to  cookies
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

// Error 404 Handler Middleware
app.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    success: false,
    message: `Route ${request.method}:${request.url} not found`,
  });
});

// Centralized Error Handling Middleware
app.setErrorHandler(centralizedError);

export { app };
