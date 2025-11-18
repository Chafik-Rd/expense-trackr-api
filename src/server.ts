import { app } from "./app.js";
import { AppDataSource } from "./data-source.js";
import { seedDatabase } from "./utils/seeder.js";

const port = Number(process.env.PORT || 8085);

(async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully! 🐘");

    await seedDatabase();

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
