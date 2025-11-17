import zod from "zod";

const createUserSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

export const createUserSchemaJSON = zod.toJSONSchema(createUserSchema);
delete createUserSchemaJSON.$schema;
