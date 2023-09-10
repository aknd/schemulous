import type {
  LiteralSchemaCore,
  LiteralValidationOptions,
  Primitive,
} from './core';
import { createLiteralParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface LiteralSchema<T extends Primitive>
  extends Schema<T>,
    LiteralSchemaCore<T> {
  readonly value: T;
}

export type LiteralSchemaBuilder = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
) => LiteralSchema<T>;

export const literal: LiteralSchemaBuilder = <T extends Primitive>(
  literalValue: T,
  options?: LiteralValidationOptions
) => {
  const baseParse = createLiteralParse(literalValue, options);
  const schema = createSchema('literal', baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<T> & { value?: T };

  schema.value = literalValue;

  return schema as LiteralSchema<T>;
};
