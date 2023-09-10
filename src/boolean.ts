import type { SchemaCore, ValidationOptions } from './core';
import { createBooleanParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface BooleanSchema extends Schema<boolean>, SchemaCore<boolean> {}

export type BooleanSchemaBuilder = (
  options?: ValidationOptions
) => BooleanSchema;

export const boolean: BooleanSchemaBuilder = (options) => {
  const baseParse = createBooleanParse(options);
  const schema = createSchema('boolean', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
