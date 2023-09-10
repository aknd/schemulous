import type { ValidationOptions } from './core';
import { createUndefinedTypeParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface UndefinedTypeSchema extends Schema<undefined> {}

export type UndefinedTypeSchemaBuilder = (
  options?: Omit<ValidationOptions, 'required_error'>
) => UndefinedTypeSchema;

export const undefinedType: UndefinedTypeSchemaBuilder = (options) => {
  const baseParse = createUndefinedTypeParse(options);
  const schema = createSchema('undefined', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
