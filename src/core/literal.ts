import type { Parse, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export type Primitive =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;

export type LiteralValidationOptions = Omit<
  ValidationOptions,
  'invalid_type_error'
> & {
  invalid_literal_error?: string | ((value: unknown) => string);
};

export const createLiteralParse =
  <T>(literalValue: T, options?: LiteralValidationOptions): Parse<T> =>
  (value, params) => {
    if (value === undefined && literalValue !== undefined) {
      const issue = createValidationIssue({
        schemaType: 'literal',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (value !== literalValue) {
      const issue = createValidationIssue({
        schemaType: 'literal',
        code: 'invalid_literal',
        value,
        message: options?.invalid_literal_error,
        literal: literalValue,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value as T;
  };

export interface LiteralSchemaCore<T extends Primitive> extends SchemaCore<T> {
  readonly value: T;
}

export type LiteralSchemaCoreBuilder = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
) => LiteralSchemaCore<T>;

export const literal: LiteralSchemaCoreBuilder = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
) => {
  const baseParse = createLiteralParse(literalValue, options);
  const schema = createSchema('literal', baseParse, {
    abortEarly: options?.abortEarly,
  }) as SchemaCore<T> & { value?: T };

  schema.value = literalValue;

  return schema as LiteralSchemaCore<T>;
};
