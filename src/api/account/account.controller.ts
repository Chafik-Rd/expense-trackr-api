import type { FastifyReply, FastifyRequest } from "fastify";
import type { AccountParams, AccountType } from "../../types/account.type.js";
import type { HttpError } from "../../types/fastify.type.js";
import type { GetQueryType } from "../../types/shared.type.js";
import { createPaginationMeta } from "../../utils/pagination.js";

// Create account
export const createAccount = async (
  req: FastifyRequest<{ Body: AccountType }>,
  reply: FastifyReply
) => {
  const accountRepo = req.server.db.account;
  const userId = req.user!.id;
  const { name, initial_balance, current_balance, is_active = true } = req.body;

  try {
    const newAccount = accountRepo.create({
      name,
      user_id: userId,
      initial_balance,
      current_balance,
      is_active,
    });
    await accountRepo.save(newAccount);

    reply.code(201).send({
      success: true,
      data: newAccount,
      message: "Account created successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Delete account
export const deleteAccount = async (
  req: FastifyRequest<{ Params: AccountParams }>,
  reply: FastifyReply
) => {
  const accountRepo = req.server.db.account;
  const userId = req.user!.id;
  const { accountId } = req.params;

  try {
    const account = await accountRepo.findOne({
      where: { id: accountId, user_id: userId },
    });

    if (!account) {
      const error: HttpError = new Error("Account not found!");
      error.status = 404;
      throw error;
    }

    await accountRepo.remove(account);

    reply.code(204).send();
  } catch (err) {
    throw err;
  }
};

// Edit account
export const editAccount = async (
  req: FastifyRequest<{ Params: AccountParams; Body: Partial<AccountType> }>,
  reply: FastifyReply
) => {
  const accountRepo = req.server.db.account;
  const userId = req.user!.id;
  const { accountId } = req.params;
  const { name, initial_balance, current_balance, is_active } = req.body;

  try {
    const account = await accountRepo.findOne({
      where: { id: accountId, user_id: userId },
    });

    if (!account) {
      const error: HttpError = new Error("Account not found!");
      error.status = 404;
      throw error;
    }

    if (name) account.name = name;
    if (initial_balance) account.initial_balance = initial_balance;
    if (current_balance) account.current_balance = current_balance;
    if (is_active) account.is_active = is_active;

    await accountRepo.save(account);

    reply.code(200).send({
      success: true,
      data: account,
      message: "Account updated successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Get account
export const getAccount = async (
  req: FastifyRequest<{ Querystring: GetQueryType }>,
  reply: FastifyReply
) => {
  const accountRepo = req.server.db.account;
  const userId = req.user!.id;
  const { page, limit } = req.query;

  const skip = (page - 1) * limit;
  try {
    const [accounts, total] = await accountRepo.findAndCount({
      where: { user_id: userId },
      take: limit,
      skip,
      order: { created_at: "DESC" },
    });

    // Pagination
    const { meta } = createPaginationMeta(total, page, limit, skip);

    reply.code(200).send({
      success: true,
      data: accounts,
      meta,
      message: "Accounts retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};
