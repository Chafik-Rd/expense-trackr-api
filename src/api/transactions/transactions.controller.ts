import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  TransactionsType,
  uploadImageToCloudType,
} from "../../types/transactions.type.js";
import { uploadImage } from "../../utils/cloudinary.js";

// Create transactiomn
export const createTransaction = async (
  req: FastifyRequest<{ Body: TransactionsType }>,
  reply: FastifyReply
) => {
  const transRepo = req.server.db.transactions;
  const { amount, file_image, note, user_id, category_id } = req.body;

  try {
    const newTrans = transRepo.create({
      amount,
      file_image,
      note,
      user_id,
      category_id,
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

// Upload image
export const uploadImageToCloud = async (
  req: FastifyRequest<{ Body: uploadImageToCloudType }>,
  reply: FastifyReply
) => {
  const { file_image } = req.body;

  try {
    const image_url = await uploadImage(file_image);
    console.log(image_url);
    reply.code(200).send({
      success: true,
      data: { url: image_url },
      message: "Upload image successfully!",
    });
  } catch (err) {
    throw err;
  }
};
