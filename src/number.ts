import type { ValidationOptions } from './core';
import { createNumberParse } from './core';
import type { WithExclusive } from './extensions';
import { int, maximum, minimum, multipleOf } from './extensions';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface NumberSchema extends Schema<number> {
  int(message?: string | ((value: number) => string)): NumberSchema;
  minimum(
    min: number,
    message?: string | ((value: number) => string)
  ): NumberSchema & WithExclusive;
  maximum(
    max: number,
    message?: string | ((value: number) => string)
  ): NumberSchema & WithExclusive;
  multipleOf(
    multiple: number,
    message?: string | ((value: number) => string)
  ): NumberSchema;
}

export type NumberSchemaBuilder = (options?: ValidationOptions) => NumberSchema;

export const number: NumberSchemaBuilder = (options) => {
  const baseParse = createNumberParse(options);
  const schema = createSchema('number', baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<number> & Partial<NumberSchema>;

  schema.int = function (
    message?: string | ((value: number) => string)
  ): NumberSchema {
    return int(this, message) as NumberSchema;
  };

  schema.minimum = function (
    min: number,
    message?: string | ((value: number) => string)
  ): NumberSchema & WithExclusive {
    return minimum(this, min, message) as NumberSchema & WithExclusive;
  };

  schema.maximum = function (
    max: number,
    message?: string | ((value: number) => string)
  ): NumberSchema & WithExclusive {
    return maximum(this, max, message) as NumberSchema & WithExclusive;
  };

  schema.multipleOf = function (
    multiple: number,
    message?: string | ((value: number) => string)
  ): NumberSchema {
    return multipleOf(this, multiple, message) as NumberSchema;
  };

  return schema as NumberSchema;
};
