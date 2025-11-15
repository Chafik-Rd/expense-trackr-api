import fastify from "fastify";
import { centralizedError } from "./middleware/centralizedError.js";
import { AppDataSource } from "./data-source.js";
import dotenv from "dotenv";
import cors from "@fastify/cors";

// Load environment variables from .env file
dotenv.config();

const app = fastify();

// CORS Middleware
const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
  ],
  credentials: true, // ✅ allow cookies to be sent
};
app.register(cors, corsOption);

app.get("/ping", async (request, reply) => {
  return "pong\n";
});

app.setErrorHandler(centralizedError);

const port = +(process.env.PORT || 8085);

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully! 🐘");
    app.listen({ port, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server running on ${address} ✅`);
    });
  } catch (err) {
    console.error("‼️ Startup error:", err);
    process.exit(1);
  }
})();
