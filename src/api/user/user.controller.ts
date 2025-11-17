import type { FastifyReply, FastifyRequest } from "fastify";
import type { HttpError } from "../../types/fastify.type.js";
import type { UserLoingType, UserType } from "../../types/user.type.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      message: "User created successfully!",
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
  const userId = req.user!.id;

  try {
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      const error: HttpError = new Error("User not found!");
      error.status = 404;
      throw error;
    }
    const { password, ...userNotPassword } = user;

    reply.code(200).send({
      success: true,
      data: userNotPassword,
      message: "User profile retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Login user
export const loginUser = async (
  req: FastifyRequest<{ Body: UserLoingType }>,
  reply: FastifyReply
) => {
  const userRepo = req.server.db.user;
  const { email, password } = req.body;

  try {
    const user = await userRepo.findOne({ where: { email } });

    // Check email user exists
    if (!user) {
      const error: HttpError = new Error("Invalid email or password!");
      error.status = 401;
      throw error;
    }

    // Check password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error: HttpError = new Error("Invalid email or password!");
      error.status = 401;
      throw error;
    }

    // Generate JWT (token)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Set token in HTTP-only cookie
    const isProd = process.env.NODE_ENV === "production";
    reply.setCookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    const { password: hashedPassword, ...userNotPassword } = user;
    reply.code(200).send({
      success: true,
      data: { user: userNotPassword },
      message: "Login successful",
    });
  } catch (err) {
    throw err;
  }
};

// Logout user
export const logoutUser = (req: FastifyRequest, reply: FastifyReply) => {
  const isProd = process.env.NODE_ENV === "production";
  reply.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
};

// Edit user profile
export const EditUserProfile = async (
  req: FastifyRequest<{ Body: Partial<UserType> }>,
  reply: FastifyReply
) => {
  const userRepo = req.server.db.user;
  const userId = req.user!.id;
  const { firstName, lastName, password } = req.body;

  try {
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      const error: HttpError = new Error("User not found!");
      error.status = 404;
      throw error;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) user.password = password;

    await userRepo.updateAll(user);

    const { password: hashedPassword, ...userNotPassword } = user;
    reply.code(200).send({
      success: true,
      data: userNotPassword,
      message: "User updated successfully!",
    });
  } catch (err) {
    throw err;
  }
};
