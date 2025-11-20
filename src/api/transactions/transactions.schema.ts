import zod from "zod";
import { summaryQuerySchema } from "../report/report.schema.js";
import { getSchemaWithoutSchemaTag } from "../../utils/schema.js";
import { getQuerySchema } from "../../schemas/shared.schema.js";

const MultipartTextField = zod.object({
  value: zod.string(),
});

// Helper สำหรับการ Parse JSON ที่ซ้อนอยู่
const parseNestedJson = (field: any) => {
  try {
    // const parsed = JSON.parse(field.value);
    return field.value;
  } catch (e) {
    throw new Error("Invalid nested JSON format in multipart field.");
  }
};

// Create transaction
export const createTransactionSchema = zod.object({
  amount: MultipartTextField.transform(parseNestedJson)
    .pipe(zod.coerce.number())
    .pipe(zod.number().min(0, "Amount must be zero or positive.")),

  note: MultipartTextField.transform(parseNestedJson)
    .pipe(zod.string().min(1, "Note cannot be empty."))
    .optional(),

  category_id: MultipartTextField.transform(parseNestedJson).pipe(
    zod.string().uuid("Invalid category ID format (must be UUID).")
  ),
  account_id: MultipartTextField.transform(parseNestedJson).pipe(
    zod.string().uuid("Invalid account ID format (must be UUID).")
  ),
  type: MultipartTextField.transform(parseNestedJson).pipe(
    zod.enum(["income", "expense"], {
      message: "Type must be 'income' or 'expense'.",
    })
  ),

  file_image: zod.any().optional(),
});
export const createTransactionSchemaJSON = getSchemaWithoutSchemaTag(
  createTransactionSchema
);

// Param transactionId Schema
export const transactionIdParamSchema = {
  type: "object",
  properties: {
    transId: {
      type: "string",
      format: "uuid",
      description: "Transaction ID (UUID) to be deleted",
    },
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

// For Swagger
export const CreateTranMultipartDocSchema = {
  type: "object",
  description:
    "Creates a new transaction, optionally including a receipt image file. Data is sent as multipart/form-data for file upload.",
  properties: {
    // 💡 Data Fields (Fastify Multipart จะส่งมาเป็น string, จึงต้องระบุ type: 'string')
    amount: {
      type: "object",
      properties: {
        value: { type: "string" },
      },
      description: "Transaction amount (e.g., 100.50).",
    },

    note: {
      type: "object",
      properties: {
        value: { type: "string" },
      },
      description: "Brief description of the transaction.",
    },
    type: {
      type: "object",
      properties: {
        value: {
          type: "string",
          // enum: ["income", "expense"],
        },
      },
      description: 'Transaction type: "income" or "expense".',
    },
    category_id: {
      type: "object",
      properties: {
        value: { type: "string" },
      },

      description: "UUID of the category.",
    },
    account_id: {
      type: "object",
      properties: {
        value: { type: "string" },
      },
      description: "UUID of the account.",
    },

    // ⭐️ File Field (สำคัญมากสำหรับ Swagger UI)
    file_image: {
      type: "string",
      format: "binary",

      // ⭐️ กำหนด format เป็น binary สำหรับการอัปโหลดไฟล์
      description: "Optional receipt image file (Max 5MB).",
    },
  },
  // กำหนดฟิลด์ที่จำเป็นใน Swagger UI
  required: ["amount", "type", "category_id", "account_id"],
};
