import zod from "zod";

export const createUserSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

export const CreateUserSchemaJSON= zod.toJSONSchema(createUserSchema)
delete CreateUserSchemaJSON.$schema;