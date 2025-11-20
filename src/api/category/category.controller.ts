import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CategoryParams,
  CategoryType,
} from "../../types/category.type.js";
import type { HttpError } from "../../types/fastify.type.js";
import type { GetQueryType } from "../../types/shared.type.js";
import { createPaginationMeta, createUrl } from "../../utils/pagination.js";
import { In } from "typeorm";

// Create category
export const createCategory = async (
  req: FastifyRequest<{ Body: CategoryType }>,
  reply: FastifyReply
) => {
  const categoryRepo = req.server.db.category;
  const userId = req.user!.id;
  const { name, type } = req.body;

  try {
    const category = await categoryRepo.findOne({
      where: { user_id: userId, name },
    });

    if (category) {
      const error: HttpError = new Error(
        "Name already in category for this user!"
      );
      error.status = 409;
      throw error;
    }

    const newCategory = categoryRepo.create({
      name,
      user_id: userId,
      type,
    });

    await categoryRepo.save(newCategory);

    reply.code(201).send({
      success: true,
      data: newCategory,
      message: "Category created successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Edit category
export const editCategory = async (
  req: FastifyRequest<{ Params: CategoryParams; Body: Partial<CategoryType> }>,
  reply: FastifyReply
) => {
  const categoryRepo = req.server.db.category;
  const userId = req.user!.id;
  const { categoryId } = req.params;
  const { name, type } = req.body;

  try {
    const category = await categoryRepo.findOne({
      where: { id: categoryId, user_id: userId },
    });

    if (!category) {
      const error: HttpError = new Error("Category not found!");
      error.status = 404;
      throw error;
    }

    if (name) category.name = name;
    if (type) category.type = type;

    await categoryRepo.save(category);

    reply.code(200).send({
      success: true,
      data: category,
      message: "Category updated successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Get category
export const getCategory = async (
  req: FastifyRequest<{ Querystring: GetQueryType }>,
  reply: FastifyReply
) => {
  const categoryRepo = req.server.db.category;
  const userId = req.user!.id;
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;
  try {
    const [categorys, total] = await categoryRepo.findAndCount({
      where: { user_id: In([userId, null]) },
      take: limit,
      skip,
      order: { created_at: "DESC" },
    });

    // Pagination
    const { meta } = createPaginationMeta(total, page, limit, skip);

    reply.code(200).send({
      success: true,
      data: categorys,
      meta,
      message: "Categorys retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Delete category
export const deleteCategory = async (
  req: FastifyRequest<{ Params: CategoryParams }>,
  reply: FastifyReply
) => {
  const categoryRepo = req.server.db.category;
  const userId = req.user!.id;
  const { categoryId } = req.params;

  try {
    const category = await categoryRepo.findOne({
      where: { id: categoryId, user_id: userId },
    });

    if (!category) {
      const error: HttpError = new Error("Category not found!");
      error.status = 404;
      throw error;
    }

    await categoryRepo.remove(category);

    reply.code(204).send();
  } catch (err) {
    throw err;
  }
};
