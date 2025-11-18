import type { FastifyReply, FastifyRequest } from "fastify";
import { uploadImage } from "../../utils/cloudinary.js";
import { createTransactionSchema } from "./transactions.schema.js";
import type { HttpError } from "../../types/fastify.type.js";
import type {
  GetTranQueryType,
  TransactionParams,
} from "../../types/transactions.type.js";
import { createPaginationMeta } from "../../utils/pagination.js";
import { badWordReplace } from "../../utils/string.js";
import { Between, type FindOptionsWhere } from "typeorm";
import type { Transactions } from "./transactions.entity.js";

// Create transactiomn
export const createTransaction = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const validatedBody = createTransactionSchema.parse(req.body);
  const { amount, file_image, note, category_id, account_id, type } =
    validatedBody;
  let image_url: string | undefined;

  try {
    // Upload file image to cloudinary
    if (file_image) {
      image_url = await uploadImage(file_image);
    }

    const newTrans = transRepo.create({
      amount,
      file_image: image_url,
      note,
      user_id: userId,
      category_id,
      account_id,
      type,
    });
    await transRepo.save(newTrans);

    reply.code(201).send({
      success: true,
      data: newTrans,
      message: "Transaction created successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Delete transaction
export const deleteTransaction = async (
  req: FastifyRequest<{ Params: TransactionParams }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { transId } = req.params;

  try {
    const transaction = await transRepo.findOne({
      where: { id: transId, user_id: userId },
    });

    if (!transaction) {
      const error: HttpError = new Error("Transaction not found!");
      error.status = 404;
      throw error;
    }

    await transRepo.remove(transaction);

    reply.code(204).send();
  } catch (err) {
    throw err;
  }
};

// Edit transaction
export const editTransaction = async (
  req: FastifyRequest<{ Params: TransactionParams }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { transId } = req.params;
  const validatedBody = createTransactionSchema.parse(req.body);
  const { amount, file_image, note, category_id, account_id, type } =
    validatedBody;

  try {
    const transaction = await transRepo.findOne({
      where: { id: transId, user_id: userId },
    });

    if (!transaction) {
      const error: HttpError = new Error("Transaction not found!");
      error.status = 404;
      throw error;
    }
    if (amount) transaction.amount = amount;
    if (note) transaction.note = note;
    if (category_id) transaction.category_id = category_id;
    if (account_id) transaction.account_id = account_id;
    if (type) transaction.type = type;
    if (file_image) {
      const image_url = await uploadImage(file_image);
      transaction.file_image = image_url;
    }

    await transRepo.updateAll(transaction);

    reply.code(20).send({
      success: true,
      data: transaction,
      message: "Transaction updated successfully!",
    });
  } catch (err) {
    throw err;
  }
};

// Get transactions
export const getTransaction = async (
  req: FastifyRequest<{ Querystring: GetTranQueryType }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { page, limit, month, year, category_id, account_id, type } = req.query;

  const skip = (page - 1) * limit;
  let filterConditions: FindOptionsWhere<Transactions> = {
    user_id: userId,
  };

  // Filter
  if (type) filterConditions.type = type;
  if (category_id) filterConditions.category_id = category_id;
  if (account_id) filterConditions.account_id = account_id;
  if (month && year) {
    const startOfMonth = new Date(`${year}-${month}-01`);
    const nextMonth = new Date(startOfMonth);
    nextMonth.setMonth(startOfMonth.getMonth() + 1);
    filterConditions.created_at = Between(startOfMonth, nextMonth);
  }

  try {
    const [transactions, total] = await transRepo.findAndCount({
      where: filterConditions,
      take: limit,
      skip,
      order: { created_at: "DESC" },
    });

    let sanitizedTransactions = transactions;

    if (transactions.length !== 0) {
      sanitizedTransactions = transactions.map((transaction) => {
        const sanitizedNote = transaction.note
          ? badWordReplace(transaction.note)
          : transaction.note;
        return {
          ...transaction,
          note: sanitizedNote,
        };
      });
    }

    // Pagination
    const { meta } = createPaginationMeta(total, page, limit, skip);

    reply.code(200).send({
      success: true,
      data: sanitizedTransactions,
      meta,
      message: "Transactions retrieved successfully!",
    });
  } catch (err) {
    throw err;
  }
};
