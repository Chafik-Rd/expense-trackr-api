import type { FastifyReply, FastifyRequest } from "fastify";
import type { HttpError } from "../../types/fastify.type.js";
import { User } from "./user.entity.js";
import { AppDataSource } from "../../data-source.js";
import type { UserType } from "../../types/user.type.js";

// Create user
export const createUser = async (
  req: FastifyRequest<{ Body: UserType }>,
  reply: FastifyReply
) => {
  const userRepo = req.server.db.user;

  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await userRepo.findOne({
      where: { email },
    });
    // Check email in database
    if (existingUser) {
      const error: HttpError = new Error("Email already in use!");
      error.status = 409;
      throw error;
    }

    // Create new user
    const newUser = userRepo.create({
      firstName,
      lastName,
      email,
      password,
    });
    await userRepo.save(newUser);

    const { password: _, ...userwithoutPass } = newUser;

    reply.code(201).send({
      success: true,
      data: userwithoutPass,
      message: "InternUser created successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Get user profile
export const getUserProfile = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const userRepo = req.server.db.user;

  try {
    const users = await userRepo.find();
    if (users.length === 0) {
      const error: HttpError = new Error("User not found!");
      error.status = 404;
      throw error;
    }

    reply.code(200).send({
      success: true,
      data: users,
      message: "User profile retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};
