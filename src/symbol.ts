import type { SchemaCore, ValidationOptions } from './core';
import { createSymbolParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface SymbolSchema extends Schema<symbol>, SchemaCore<symbol> {}

export type SymbolSchemaBuilder = (options?: ValidationOptions) => SymbolSchema;

export const symbol: SymbolSchemaBuilder = (options) => {
  const baseParse = createSymbolParse(options);
  const schema = createSchema('symbol', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
