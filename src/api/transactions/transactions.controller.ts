import type { FastifyReply, FastifyRequest } from "fastify";
import { uploadImage } from "../../utils/cloudinary.js";
import { createTransactionSchema } from "./transactions.schema.js";
import type { HttpError } from "../../types/fastify.type.js";
import type {
  ExportTransQueryType,
  GetTranQueryType,
  TransactionParams,
} from "../../types/transactions.type.js";
import { createPaginationMeta } from "../../utils/pagination.js";
import { badWordReplace } from "../../utils/string.js";
import { Between, type FindOptionsWhere } from "typeorm";
import { Transactions } from "./transactions.entity.js";
import { Account } from "../account/account.entity.js";
import { formatDate, getExportDateRange } from "../../utils/date.js";
import { exportFile } from "../../utils/exportFile.js";

// Create transactiomn
export const createTransaction = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const queryRunner = req.server.db.dataSource.createQueryRunner();
  const userId = req.user!.id;
  const validatedBody = createTransactionSchema.parse(req.body);
  const { amount, file_image, note, category_id, account_id, type } =
    validatedBody;

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Upload file image to cloudinary
    const image_url = file_image ? await uploadImage(file_image) : undefined;

    const newTrans = queryRunner.manager.create(Transactions, {
      amount,
      file_image: image_url,
      note,
      user_id: userId,
      category_id,
      account_id,
      type,
    });
    await queryRunner.manager.save(newTrans);

    const amountChange = type === "income" ? amount : -amount;

    await queryRunner.manager
      .createQueryBuilder()
      .update(Account)
      .set({ current_balance: () => `current_balance + ${amountChange}` })
      .where("id = :account_id", { account_id })
      .execute();

    await queryRunner.commitTransaction();
    reply.code(201).send({
      success: true,
      data: newTrans,
      message: "Transaction created successfully!",
    });
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

// Delete transaction
export const deleteTransaction = async (
  req: FastifyRequest<{ Params: TransactionParams }>,
  reply: FastifyReply
) => {
  const queryRunner = req.server.db.dataSource.createQueryRunner();
  const userId = req.user!.id;
  const { transId } = req.params;

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const transaction = await queryRunner.manager.findOne(Transactions, {
      where: { id: transId, user_id: userId },
    });

    if (!transaction) {
      const error: HttpError = new Error("Transaction not found!");
      error.status = 404;
      throw error;
    }

    await queryRunner.manager.remove(transaction);

    const rollbackAmount =
      transaction.type === "income" ? -transaction.amount : transaction.amount;

    await queryRunner.manager
      .createQueryBuilder()
      .update(Account)
      .set({ current_balance: () => `current_balance + ${rollbackAmount}` })
      .where("id = :account_id", { account_id: transaction.account_id })
      .execute();

    await queryRunner.commitTransaction();

    reply.code(204).send();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

// Edit transaction
export const editTransaction = async (
  req: FastifyRequest<{ Params: TransactionParams }>,
  reply: FastifyReply
) => {
  const queryRunner = req.server.db.dataSource.createQueryRunner();
  const userId = req.user!.id;
  const { transId } = req.params;
  const validatedBody = createTransactionSchema.parse(req.body);
  const { amount, file_image, note, category_id, account_id, type } =
    validatedBody;

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const oldTrans = await queryRunner.manager.findOne(Transactions, {
      where: { id: transId, user_id: userId },
    });

    if (!oldTrans) {
      const error: HttpError = new Error("Transaction not found!");
      error.status = 404;
      throw error;
    }

    // Roll back amount from account
    const rollbackAmount =
      oldTrans.type === "income" ? -oldTrans.amount : oldTrans.amount;

    await queryRunner.manager
      .createQueryBuilder()
      .update(Account)
      .set({ current_balance: () => `current_balance + ${rollbackAmount}` })
      .where("id = :account_id", { account_id: oldTrans.account_id })
      .execute();

    // Edit transaction
    const newTrans = oldTrans;
    if (amount) newTrans.amount = amount;
    if (note) newTrans.note = note;
    if (category_id) newTrans.category_id = category_id;
    if (account_id) newTrans.account_id = account_id;
    if (type) newTrans.type = type;
    if (file_image) {
      const image_url = await uploadImage(file_image);
      newTrans.file_image = image_url;
    }

    await queryRunner.manager.save(newTrans);

    // Apply amount from account
    const applyAmount =
      newTrans.type === "income" ? newTrans.amount : -newTrans.amount;

    await queryRunner.manager
      .createQueryBuilder()
      .update(Account)
      .set({ current_balance: () => `current_balance + ${applyAmount}` })
      .where("id = :account_id", { account_id: newTrans.account_id })
      .execute();

    await queryRunner.commitTransaction();
    reply.code(200).send({
      success: true,
      data: newTrans,
      message: "Transaction updated successfully!",
    });
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
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

    const sanitizedTransactions = transactions.map((transaction) => ({
      ...transaction,
      note: transaction.note
        ? badWordReplace(transaction.note)
        : transaction.note,
    }));

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

// Get transactions export
export const getTransactionExport = async (
  req: FastifyRequest<{ Querystring: ExportTransQueryType }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const userId = req.user!.id;
  const { format, startDate, endDate } = req.query;

  // Default startDate and endDate
  const dateRange = getExportDateRange(startDate, endDate);

  try {
    const transactions = await transRepo.find({
      where: {
        user_id: userId,
        created_at: Between(dateRange.start, dateRange.endFilter),
      },
      select: {
        id: true,
        amount: true,
        type: true,
        note: true,
        created_at: true,
        category: {
          name: true,
        },
        account: {
          name: true,
        },
      },
      relations: { category: true, account: true },
    });

    // Export file
    const csvOptions = {
      header: "Date,Account,Amount,Type,Category,Note\n",
      content: transactions
        .map(
          (t) =>
            `${formatDate(t.created_at)},${t.account.name},${t.amount},${
              t.type
            },${t.category.name},"${(t.note || "").replace(/"/g, '""')}"`
        )
        .join("\n"),
    };

    const { content, contentType, ExportFormat } = exportFile(
      format,
      transactions,
      csvOptions
    );
    const fileName = `transactions_export_${formatDate(
      dateRange.start
    )}_to_${formatDate(dateRange.end)}.${ExportFormat}`;
    reply.header("Content-Type", contentType);
    reply.header("Content-Disposition", `attachment; filename=${fileName}`);
    reply.send(content);
  } catch (err) {
    throw err;
  }
};
