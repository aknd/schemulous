import type { SchemaCore, ValidationOptions } from './schema';
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

export interface LiteralSchemaCore<T extends Primitive> extends SchemaCore<T> {
  readonly value: T;
}

export const createLiteralSchemaBase = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
): Pick<LiteralSchemaCore<T>, 'baseParse' | 'value'> => {
  const schema = { value: literalValue } as Partial<LiteralSchemaCore<T>>;

  schema.baseParse = (value, params): T => {
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

  return schema as Pick<LiteralSchemaCore<T>, 'baseParse' | 'value'>;
};

export type LiteralSchemaCoreBuilder = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
) => LiteralSchemaCore<T>;

export const literal: LiteralSchemaCoreBuilder = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
) => {
  const baseSchema = createLiteralSchemaBase(literalValue, options);
  const schema = createSchema('literal', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  }) as SchemaCore<T> & { value?: T };
  Object.assign(schema, baseSchema);

  return schema as LiteralSchemaCore<T>;
};
