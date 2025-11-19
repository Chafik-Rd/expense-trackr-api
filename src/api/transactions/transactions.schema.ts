import zod from "zod";
import { summaryQuerySchema } from "../report/report.schema.js";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";
import { getQuerySchema } from "../../schemas/shared.schema.js";

const MultipartTextField = zod.object({
  value: zod.string(),
});

// Create transaction
export const createTransactionSchema = zod.object({
  amount: MultipartTextField.transform((field) => field.value)
    .pipe(zod.coerce.number())
    .pipe(zod.number().min(0, "Amount must be zero or positive.")),

  note: MultipartTextField.transform((field) => field.value)
    .pipe(zod.string().min(1, "Note cannot be empty."))
    .optional(),

  category_id: MultipartTextField.transform((field) => field.value).pipe(
    zod.string().uuid("Invalid category ID format (must be UUID).")
  ),
  account_id: MultipartTextField.transform((field) => field.value).pipe(
    zod.string().uuid("Invalid account ID format (must be UUID).")
  ),
  type: MultipartTextField.transform((field) => field.value).pipe(
    zod.enum(["income", "expense"], {
      message: "Type must be 'income' or 'expense'.",
    })
  ),

  file_image: zod.any().optional(),
});

// Param transactionId Schema
export const transactionIdParamSchema = {
  type: "object",
  properties: {
    transId: {
      type: "string",
      format: "uuid",
      description: "Transaction ID (UUID) to be deleted",
    },
    additionalProperties: false,
  },
};

// Export transaction query schema
export const exportTransQuerySchema = zod.object({
  ...summaryQuerySchema.shape,
  format: zod
    .enum(["csv", "json"], {
      message: "Export format must be 'csv' or 'json'.",
    })
    .default("csv"),
});
export const exportTransQuerySchemaJSON = getSchemaWithoutSchemaTag(
  exportTransQuerySchema
);

// Get transaction query schema
export const getTranQuerySchema = zod.object({
  ...getQuerySchema.shape,
  month: zod.coerce.number().int().min(1).max(12).optional(),
  year: zod.coerce.number().int().min(2000).max(3000).optional(),
  category_id: zod
    .string()
    .uuid("Invalid category ID format (must be UUID).")
    .optional(),
  account_id: zod
    .string()
    .uuid("Invalid account ID format (must be UUID).")
    .optional(),
  type: zod
    .enum(["income", "expense"], {
      message: "Type must be 'income' or 'expense'.",
    })
    .optional(),
});
export const getTranQuerySchemaJSON =
  getSchemaWithoutSchemaTag(getTranQuerySchema);
