import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authUser } from "../../middleware/authUser.js";
import {
  getDailyBudget,
  getSummary,
  getSummaryExport,
} from "./report.controller.js";

export const reportRoutes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // Middleware auth user
  fastify.addHook("preHandler", authUser);

  // Get summary
  fastify.get("/summary", {
    handler: getSummary,
  });
  // Get daily budget
  fastify.get("/daily-budget", {
    handler: getDailyBudget,
  });
  // Get summary export
  fastify.get("/summary/export", {
    handler: getSummaryExport,
  });
};
