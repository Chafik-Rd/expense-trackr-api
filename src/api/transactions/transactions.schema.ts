import zod, { property, uuid } from "zod";

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

export const transactionIdParamSchema = {
  type: "object",
  property: {
    transId: {
      type: "string",
      format: "uuid",
      description: "Transaction ID (UUID) to be deleted",
    },
    required: ["transId"],
    additionalProperties: false,
  },
};
