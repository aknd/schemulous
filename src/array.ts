import type { ArraySchemaCore, ValidationOptions } from './core';
import { createArrayParse } from './core';
import { maxItems, minItems } from './extensions';
import type { Schema } from './schema';
import { createSchema } from './schema';

export type ElementSchema<E> = Schema<E>;
// NOTE: Distinguishing between 'RecordSchema' and 'ObjectSchema' can be challenging due to their structural similarities.
// E extends { [key: string]: unknown }
//   ? ObjectSchema<E>
//   : E extends unknown[]
//   ? ArraySchema<E[number]>
//   : Schema<E>;

export interface ArraySchema<E> extends Schema<E[]>, ArraySchemaCore<E> {
  element: ElementSchema<E>;
  minItems(min: number, message?: string): ArraySchema<E>;
  maxItems(max: number, message?: string): ArraySchema<E>;
}

export type ArraySchemaBuilder = <E>(
  elementSchema: Schema<E>,
  options?: ValidationOptions
) => ArraySchema<E>;

export const array: ArraySchemaBuilder = <E>(
  elementSchema: Schema<E>,
  options?: ValidationOptions
) => {
  const baseParse = createArrayParse(elementSchema, options);
  const schema = createSchema('array', baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<E[]> & Partial<ArraySchema<E>>;

  schema.element = elementSchema;

  schema.minItems = function (min: number, message?: string): ArraySchema<E> {
    return minItems(this, min, message) as ArraySchema<E>;
  };

  schema.maxItems = function (max: number, message?: string): ArraySchema<E> {
    return maxItems(this, max, message) as ArraySchema<E>;
  };

  return schema as ArraySchema<E>;
};
