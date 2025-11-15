import fastify from "fastify";
import joi from "joi";

export const createUserSchema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  age: joi.number.integer().min(0),
});
