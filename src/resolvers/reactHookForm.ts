import type { SchemaCore } from '../core';
import { ValidationError, parse } from '../core';

export type FieldValues = { [key: string]: unknown };

export type FieldError = {
  type: string;
  message: string;
};

export type FieldErrors<T extends FieldValues> = {
  [K in keyof T]?: T[K] extends { [key: string]: unknown }
    ? FieldErrors<T[K]>
    : T[K] extends unknown[]
    ? FieldError[]
    : FieldError;
};

export type ResolverSuccess<T extends FieldValues> = {
  values: T;
  errors: { [key: string]: never };
};

const setNestedValue = <T extends FieldValues>(
  obj: FieldErrors<T>,
  path: (string | number)[],
  fieldError: FieldError
): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (i === path.length - 1) {
      if (!current[key]) {
        current[key] = fieldError;
      }

      return;
    }

    if (typeof path[i + 1] === 'number' && !Array.isArray(current[key])) {
      current[key] = [];
    } else if (!current[key]) {
      current[key] = {};
    }

    current = current[key];
  }
};

export type ResolverError<T extends FieldValues> = {
  values: { [key: string]: never };
  errors: FieldErrors<T>;
};

export type ResolverResult<T extends FieldValues> =
  | ResolverSuccess<T>
  | ResolverError<T>;

export const reactHookFormResolver = <T extends FieldValues>(
  schema: SchemaCore<T>
): ((values: T) => ResolverResult<T>) => {
  return (values) => {
    try {
      const validatedData = parse(schema, values);

      return {
        values: validatedData,
        errors: {},
      };
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = err.issues.reduce((acc, issue) => {
          setNestedValue(acc, issue.path, {
            type: issue.code,
            message: issue.message,
          });

          return acc;
        }, {} as FieldErrors<T>);

        return {
          values: {},
          errors,
        };
      }

      throw err;
    }
  };
};
