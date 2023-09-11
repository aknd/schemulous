import type { LiteralSchemaCore, LiteralValidationOptions } from './core';
import { createLiteralSchemaBase } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface LiteralSchema<T> extends Schema<T>, LiteralSchemaCore<T> {
  readonly value: T;
}

export type LiteralSchemaBuilder = <T>(
  literalValue: T,
  options?: LiteralValidationOptions
) => LiteralSchema<T>;

export const literal: LiteralSchemaBuilder = <T>(
  literalValue: T,
  options?: LiteralValidationOptions
) => {
  const baseSchema = createLiteralSchemaBase(literalValue, options);
  const schema = createSchema('literal', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<T> & { value?: T };
  Object.assign(schema, baseSchema);

  return schema as LiteralSchema<T>;
};
