import type { Infer, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { parse } from './parse';
import { ValidationError, createValidationIssue } from './errors';

export type UnionValidationOptions = Omit<
  ValidationOptions,
  'invalid_type_error'
> & {
  invalid_union_error?: string;
};

export interface UnionSchemaCore<
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
> extends SchemaCore<Infer<U[number]>> {
  schemas: readonly [...U];
}

export const createUnionSchemaBase = <
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
>(
  schemas: U,
  options?: UnionValidationOptions
): Pick<UnionSchemaCore<U>, 'baseParse' | 'schemas'> => {
  const schema = { schemas } as Partial<UnionSchemaCore<U>>;

  schema.baseParse = (value, params): Infer<U[number]> => {
    for (const schema of schemas) {
      try {
        return parse(schema as SchemaCore<Infer<U[number]>>, value, params);
      } catch (_err) {}
    }

    const issue = createValidationIssue({
      schemaType: 'union',
      value,
      code: 'invalid_union',
      path: params?.path,
      message: options?.invalid_union_error,
    });
    throw new ValidationError([issue]);
  };

  return schema as Pick<UnionSchemaCore<U>, 'baseParse' | 'schemas'>;
};

export type UnionSchemaCoreBuilder = <
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
>(
  schemas: U,
  options?: UnionValidationOptions
) => UnionSchemaCore<U>;

export const union: UnionSchemaCoreBuilder = <
  U extends [
    SchemaCore<unknown>,
    SchemaCore<unknown>,
    ...SchemaCore<unknown>[],
  ],
>(
  schemas: U,
  options?: UnionValidationOptions
) => {
  const baseSchema = createUnionSchemaBase(schemas, options);
  const schema = createSchema('union', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as UnionSchemaCore<U>;
};
