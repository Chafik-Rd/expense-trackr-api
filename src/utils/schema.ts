import zod from "zod";

export const getSchemaWithoutSchemaTag = (schema: zod.ZodObject<any>) => {
    const jsonSchema = zod.toJSONSchema(schema);
    delete jsonSchema.$schema;
    return jsonSchema;
};