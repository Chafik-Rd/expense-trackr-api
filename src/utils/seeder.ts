import { IsNull } from "typeorm";
import { Category } from "../api/category/category.entity.js";
import { AppDataSource } from "../data-source.js";
import { initialCategories } from "../data/seed.data.js";

export const seedDatabase = async (): Promise<void> => {
  const categoryRepo = AppDataSource.getRepository(Category);

  try {
    // Check data from SYSTEM_USER_ID
    const existingCount = await categoryRepo.count({
      where: { user_id: IsNull()},
    });

    if (existingCount === 0) {
      console.log("🚀 Starting initial database seeding...");

      const categoriesToSave = categoryRepo.create(initialCategories);
      await categoryRepo.save(categoriesToSave);

      console.log(`✅ Seeded ${categoriesToSave.length} initial categories.`);
    } else {
      console.log(
        `💡 Initial categories already exist (${existingCount} found). Skipping seed.`
      );
    }
  } catch (err) {
    console.error("❌ Database seeding failed:", err);
    throw err;
  }
};
