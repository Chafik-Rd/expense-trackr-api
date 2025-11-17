import type { FastifyReply, FastifyRequest } from "fastify";
import { uploadImage } from "../../utils/cloudinary.js";
import { createTransactionSchema } from "./transactions.schema.js";
import type { HttpError } from "../../types/fastify.type.js";
import type { TransactionParams } from "../../types/transactions.type.js";

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
      type
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
