import { string, StringSchema, ValidationError } from "yup";

/**
 * Custom sequential validation schema for yup.
 *
 * Based on https://github.com/jquense/yup/issues/851#issuecomment-931295671
 * @see https://github.com/jquense/yup/issues/851#issuecomment-1135881029
 */
export function yupSequentialStringSchema(schemas: StringSchema[]) {
  return string().test(async (value, context) => {
    try {
      for (const schema of schemas) {
        // eslint-disable-next-line no-await-in-loop
        await schema.validate(value);
      }
    } catch (error: unknown) {
      console.log(error);
      const message = (error as ValidationError).message;
      return context.createError({ message });
    }

    return true;
  });
}

// https://github.com/jquense/yup/issues/256#issuecomment-520520736 another way to chain validations
