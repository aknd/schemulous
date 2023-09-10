import type { SchemaCore, ValidationOptions } from './core';
import { createNullTypeParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface NullTypeSchema extends Schema<null>, SchemaCore<null> {}

export type NullTypeSchemaBuilder = (
  options?: ValidationOptions
) => NullTypeSchema;

export const nullType: NullTypeSchemaBuilder = (options) => {
  const baseParse = createNullTypeParse(options);
  const schema = createSchema('null', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
