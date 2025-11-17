import zod from "zod";

const createTransactionSchema = zod.object({
  amount: zod.number().min(0),
  file_image: zod.string().url().optional(),
  note: zod.string().optional(),
  user_id: zod.string(),
  category_id: zod.string(),
});
export const createTransactionSchemaJSON = zod.toJSONSchema(
  createTransactionSchema
);
delete createTransactionSchemaJSON.$schema;

// Upload image to cloudinary
const UploadImageBodySchema = zod.object({
  file_image: zod.any(),
});
export const UploadImageBodySchemaJSON = zod.toJSONSchema(
  UploadImageBodySchema
);
delete UploadImageBodySchemaJSON.$schema;
