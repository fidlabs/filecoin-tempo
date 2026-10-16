import { prettifyError, z, ZodType } from "zod";

export type NumericalString = `${"-" | ""}${number}`;

const numericalStringRegex = /^-?\d{1,}$/;

export const numericalStringSchema = z
  .custom<NumericalString>()
  .refine((input) => {
    return typeof input === "string" && numericalStringRegex.test(input);
  });

export function parseSchema<T>(
  input: unknown,
  schema: ZodType<T>,
  message = "Input does not match schema"
): T {
  const result = schema.safeParse(input);

  if (result.error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(prettifyError(result.error));
    }

    throw new TypeError(message);
  }

  return result.data;
}
