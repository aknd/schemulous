import type {
  Infer,
  IntersectionSchemaCore,
  MergeIntersection,
  ValidationOptions,
} from './core';
import { createIntersectionSchemaBase } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface IntersectionSchema<
  U extends [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]],
> extends Schema<MergeIntersection<{ [I in keyof U]: Infer<U[I]> }>>,
    IntersectionSchemaCore<U> {
  schemas: readonly [...U];
}

export type IntersectionSchemaBuilder = <
  U extends [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]],
>(
  schemas: U,
  options?: Omit<ValidationOptions, 'invalid_type_error'>
) => IntersectionSchema<U>;

export const intersection: IntersectionSchemaBuilder = <
  U extends [Schema<unknown>, Schema<unknown>, ...Schema<unknown>[]],
>(
  schemas: U,
  options?: Omit<ValidationOptions, 'invalid_type_error'>
) => {
  const baseSchema = createIntersectionSchemaBase(schemas, options);
  const schema = createSchema('intersection', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as IntersectionSchema<U>;
};
