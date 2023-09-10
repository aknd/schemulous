/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SchemaCore, ValidationOptions } from './core';
import { anyParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface AnySchema extends Schema<any>, SchemaCore<any> {}

export type AnySchemaBuilder = (
  options?: Pick<ValidationOptions, 'abortEarly'>
) => AnySchema;

export const any: AnySchemaBuilder = (options) => {
  const schema = createSchema('any', anyParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
