import type { Infer, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import type { ObjectSchemaCore } from './object';
import type { WithObjectSchemaEx } from '../extensions';
import { copy, parse, passthrough } from '../extensions';
import type { ValidationIssue } from './errors';
import { ValidationError } from './errors';
import { getType } from '../helpers';

export type MergeIntersection<Tuple> = Tuple extends [
  infer First,
  ...infer Rest,
]
  ? First & MergeIntersection<Rest>
  : unknown;

export interface IntersectionSchemaCore<
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
> extends SchemaCore<MergeIntersection<{ [I in keyof U]: Infer<U[I]> }>> {
  schemas: readonly [...U];
}

export const createIntersectionSchemaBase = <
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
>(
  schemas: U,
  options?: Omit<ValidationOptions, 'invalid_type_error'>
): Pick<IntersectionSchemaCore<U>, 'baseParse' | 'schemas'> => {
  const schema = { schemas } as Partial<IntersectionSchemaCore<U>>;

  schema.baseParse = (
    value,
    params
  ): MergeIntersection<{ [I in keyof U]: Infer<U[I]> }> => {
    let result: unknown;
    const issues: ValidationIssue[] = [];

    let passthroughAll = true;
    const allowedKeys = new Set<string>();

    for (const schema of schemas) {
      try {
        let currentSchema = schema;
        if (schema.schemaType === 'object') {
          const schemaWithEx = schema as ObjectSchemaCore<unknown> &
            WithObjectSchemaEx;
          const keys = Object.keys(schemaWithEx.shape);
          keys.forEach((key) => allowedKeys.add(key));
          if (schemaWithEx._strict || !schemaWithEx._passthrough) {
            passthroughAll = false;
          }
          if (!schemaWithEx._strict && !schemaWithEx._passthrough) {
            currentSchema = passthrough(copy(schemaWithEx));
          }
        }
        result = parse(currentSchema, value, params);
      } catch (err) {
        if (err instanceof ValidationError) {
          issues.push(...err.issues);
          if (options?.abortEarly) {
            throw new ValidationError(issues);
          }
        } else {
          throw err;
        }
      }
    }

    if (issues.length > 0) {
      throw new ValidationError(issues);
    }

    if (getType(result) === 'object' && !passthroughAll) {
      for (const key in result as { [k: string]: unknown }) {
        if (!allowedKeys.has(key)) {
          delete (result as { [k: string]: unknown })[key];
        }
      }
    }

    return result as MergeIntersection<{ [I in keyof U]: Infer<U[I]> }>;
  };

  return schema as Pick<IntersectionSchemaCore<U>, 'baseParse' | 'schemas'>;
};

export type IntersectionSchemaCoreBuilder = <
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
>(
  schemas: U,
  options?: Omit<ValidationOptions, 'invalid_type_error'>
) => IntersectionSchemaCore<U>;

export const intersection: IntersectionSchemaCoreBuilder = <
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
>(
  schemas: U,
  options?: Omit<ValidationOptions, 'invalid_type_error'>
) => {
  const baseSchema = createIntersectionSchemaBase(schemas, options);
  const schema = createSchema('intersection', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as IntersectionSchemaCore<U>;
};
