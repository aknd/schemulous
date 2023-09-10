import type { Parse, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { parse } from '../extensions';
import type { ValidationIssue } from './errors';
import { ValidationError, createValidationIssue } from './errors';

export type ElementSchemaCore<E> = SchemaCore<E>;

export const createArrayParse =
  <E>(
    elementSchema: ElementSchemaCore<E>,
    options?: ValidationOptions
  ): Parse<E[]> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'array',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (!Array.isArray(value)) {
      const issue = createValidationIssue({
        schemaType: 'array',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    const result: E[] = [];
    const issues: ValidationIssue[] = [];

    for (let i = 0; i < value.length; i++) {
      try {
        result.push(
          parse(elementSchema, value[i], {
            ...params,
            path: [...(params?.path ?? []), i],
          })
        );
      } catch (err) {
        if (err instanceof ValidationError) {
          issues.push(...err.issues);
          if (options?.abortEarly) {
            throw new ValidationError(issues);
          }
        } else {
          throw err;
        }
      }
    }

    if (issues.length > 0) {
      throw new ValidationError(issues);
    }

    return result;
  };

export interface ArraySchemaCore<E> extends SchemaCore<E[]> {
  element: ElementSchemaCore<E>;
}

export type ArraySchemaCoreBuilder = <E>(
  elementSchema: SchemaCore<E>,
  options?: ValidationOptions
) => ArraySchemaCore<E>;

export const array: ArraySchemaCoreBuilder = <E>(
  elementSchema: SchemaCore<E>,
  options?: ValidationOptions
) => {
  const baseParse = createArrayParse(elementSchema, options);
  const schema = createSchema('array', baseParse, {
    abortEarly: options?.abortEarly,
  }) as SchemaCore<E[]> & Partial<ArraySchemaCore<E>>;

  schema.element = elementSchema;

  return schema as ArraySchemaCore<E>;
};
