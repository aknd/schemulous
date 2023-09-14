import type { ParseParams, SchemaCore } from './schema';
import type { WithPrivateProps } from '../extensions';
import { ValidationError } from './errors';

export const parse = <T>(
  schema: SchemaCore<T> & WithPrivateProps<T>,
  value: unknown,
  params?: ParseParams
): T => {
  if (value === undefined && schema._default) return schema._default as T;
  if (value === undefined && schema._optional) return value as unknown as T;
  if (value === null && schema._nullable) return value as unknown as T;

  for (const preprocess of schema._preprocesses ?? []) {
    value = preprocess(value);
  }

  let result: T | undefined;

  try {
    result = schema.baseParse(value, params);
  } catch (err) {
    if (schema._fallback !== undefined) {
      const fallbackValue =
        typeof schema._fallback === 'function'
          ? schema._fallback()
          : schema._fallback;

      return fallbackValue as T;
    }

    throw err;
  }

  for (const postprocess of schema._postprocesses ?? []) {
    result = postprocess(result);
  }

  for (const refinement of schema._refinements ?? []) {
    const isValid = refinement(schema, result, schema.schemaType, params?.path);
    if (!isValid && schema._fallback !== undefined) {
      const fallbackValue =
        typeof schema._fallback === 'function'
          ? schema._fallback()
          : schema._fallback;

      return fallbackValue as T;
    }
    if (!isValid && schema.ctx?.abortEarly) {
      break;
    }
  }

  if (schema._issues?.length) {
    const error = new ValidationError(schema._issues);
    delete schema._issues;
    throw error;
  }

  return result as T;
};

export type SafeParseSuccess<T> = {
  success: true;
  data: T;
};

export type SafeParseError = {
  success: false;
  error: ValidationError;
};

export const safeParse = <T>(
  schema: SchemaCore<T> & WithPrivateProps<T>,
  value: unknown,
  params?: ParseParams
): SafeParseSuccess<T> | SafeParseError => {
  try {
    const data = parse(schema, value, params);

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error,
      };
    }

    throw error;
  }
};
