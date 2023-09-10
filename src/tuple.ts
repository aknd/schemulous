import type { Infer, TupleSchemaCore, TupleValidationOptions } from './core';
import { createTupleSchemaBase } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface TupleSchema<SS extends [Schema<unknown>, ...Schema<unknown>[]]>
  extends Schema<{ [I in keyof SS]: Infer<SS[I]> }>,
    TupleSchemaCore<SS> {
  elements: readonly [...SS];
}

export type TupleSchemaBuilder = <
  SS extends [Schema<unknown>, ...Schema<unknown>[]],
>(
  schemas: SS,
  options?: TupleValidationOptions
) => TupleSchema<SS>;

export const tuple: TupleSchemaBuilder = <
  SS extends [Schema<unknown>, ...Schema<unknown>[]],
>(
  schemas: SS,
  options?: TupleValidationOptions
) => {
  const baseSchema = createTupleSchemaBase(schemas, options);
  const schema = createSchema('tuple', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as TupleSchema<SS>;
};
