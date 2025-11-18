import zod from "zod";

const MultipartTextField = zod.object({
  value: zod.string(),
});

// Create transaction
export const createTransactionSchema = zod.object({
  amount: MultipartTextField.transform((field) => field.value)
    .pipe(zod.coerce.number())
    .pipe(zod.number().min(0)),

  note: MultipartTextField.transform((field) => field.value)
    .pipe(zod.string())
    .optional(),

  category_id: MultipartTextField.transform((field) => field.value).pipe(
    zod.string()
  ),
  account_id: MultipartTextField.transform((field) => field.value).pipe(
    zod.string()
  ),
  type: MultipartTextField.transform((field) => field.value).pipe(
    zod.enum(["income", "expense"])
  ),

  file_image: zod.any().optional(),
});
