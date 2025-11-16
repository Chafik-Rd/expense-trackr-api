import fastify from "fastify";
import dotenv from "dotenv";

import userRoutes from "./api/user/user.route.js";
import { centralizedError } from "./middleware/centralizedError.js";
import dbPlugin from "./plugins/db.js";

// Load environment variables from .env file
dotenv.config();

const app = fastify({
  logger: true,
});

app.register(dbPlugin);
// API Routes
app.register(userRoutes,{prefix:"/api/v1/user"});

// Centralized Error Handling Middleware
app.setErrorHandler(centralizedError);

export { app };
