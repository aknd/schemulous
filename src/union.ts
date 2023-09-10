import type { Infer, UnionSchemaCore, UnionValidationOptions } from './core';
import { createUnionSchemaBase } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface UnionSchema<
  U extends [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]],
> extends Schema<Infer<U[number]>>,
    UnionSchemaCore<U> {
  schemas: readonly [...U];
}

export type UnionSchemaBuilder = <
  U extends [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]],
>(
  schemas: U,
  options?: UnionValidationOptions
) => UnionSchema<U>;

export const union: UnionSchemaBuilder = <
  U extends [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]],
>(
  schemas: U,
  options?: UnionValidationOptions
) => {
  const baseSchema = createUnionSchemaBase(schemas, options);
  const schema = createSchema('union', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as UnionSchema<U>;
};
