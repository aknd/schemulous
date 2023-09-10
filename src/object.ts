import type { ObjectSchemaCore, ValidationOptions } from './core';
import { createObjectSchemaBase } from './core';
import { passthrough, strict } from './extensions';
import type { Schema } from './schema';
import { createSchema } from './schema';

export type Shape<T> = {
  [K in keyof T]: Schema<T[K]>;
  // NOTE: Distinguishing between 'RecordSchema' and 'ObjectSchema' can be challenging due to their structural similarities.
  // [K in keyof T]: T[K] extends { [key: string]: unknown }
  //   ? ObjectSchema<T[K]>
  //   : T[K] extends unknown[]
  //   ? ArraySchema<T[K][number]>
  //   : Schema<T[K]>;
};

export interface ObjectSchema<T> extends Schema<T>, ObjectSchemaCore<T> {
  shape: Shape<T>;
  passthrough(): ObjectSchema<T & { [k: string]: unknown }>;
  strict(mesasge?: string): ObjectSchema<T>;
}

export type ObjectSchemaBuilder = <T>(
  shape: Shape<T>,
  options?: ValidationOptions
) => ObjectSchema<T>;

export const object: ObjectSchemaBuilder = <T>(
  shape: Shape<T>,
  options?: ValidationOptions
) => {
  const schemaBase = createObjectSchemaBase<T>(shape, options);
  const schema = createSchema<T>('object', schemaBase.baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<T> & Partial<ObjectSchema<T>>;
  Object.assign(schema, schemaBase);

  schema.passthrough = function (): ObjectSchema<T & { [k: string]: unknown }> {
    return passthrough(this) as ObjectSchema<T & { [k: string]: unknown }>;
  };

  schema.strict = function (message?: string): ObjectSchema<T> {
    return strict(this, message) as ObjectSchema<T>;
  };

  return schema as ObjectSchema<T>;
};
