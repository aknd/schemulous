import type { Infer, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { parse } from '../extensions';
import type { ValidationIssue } from './errors';
import { ValidationError, createValidationIssue } from './errors';

export type TupleValidationOptions = ValidationOptions & {
  too_small_error?: string | ((value: unknown[]) => string);
  too_big_error?: string | ((value: unknown[]) => string);
};

export interface TupleSchemaCore<
  SS extends [SchemaCore<unknown>, ...SchemaCore<unknown>[]],
> extends SchemaCore<{ [I in keyof SS]: Infer<SS[I]> }> {
  elements: readonly [...SS];
}

export const createTupleSchemaBase = <
  SS extends [SchemaCore<unknown>, ...SchemaCore<unknown>[]],
>(
  schemas: SS,
  options?: TupleValidationOptions
): Pick<TupleSchemaCore<SS>, 'baseParse' | 'elements'> => {
  const schema = { elements: schemas } as Partial<TupleSchemaCore<SS>>;

  schema.baseParse = (value, params): { [I in keyof SS]: Infer<SS[I]> } => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'tuple',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (!Array.isArray(value)) {
      const issue = createValidationIssue({
        schemaType: 'tuple',
        code: 'invalid_type',
        value: value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (value.length < schemas.length) {
      const issue = createValidationIssue({
        schemaType: 'tuple',
        code: 'too_small',
        value: value,
        message: options?.too_small_error,
        minimum: schemas.length,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (value.length > schemas.length) {
      const issue = createValidationIssue({
        schemaType: 'tuple',
        code: 'too_big',
        value: value,
        message: options?.too_big_error,
        maximum: schemas.length,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    const result = [];
    const issues: ValidationIssue[] = [];

    for (let i = 0; i < schemas.length ?? 0; i++) {
      const schema = schemas[i];
      const item = value[i];
      const path = [...(params?.path ?? []), i];
      let parsedItem: Infer<typeof schema> | undefined;
      try {
        parsedItem = parse(schema, item, { path });
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

      result.push(parsedItem as Infer<typeof schema>);
    }

    if (issues.length > 0) {
      throw new ValidationError(issues);
    }

    return result as { [I in keyof SS]: Infer<SS[I]> };
  };

  return schema as Pick<TupleSchemaCore<SS>, 'baseParse' | 'elements'>;
};

export type TupleSchemaCoreBuilder = <
  SS extends [SchemaCore<unknown>, ...SchemaCore<unknown>[]],
>(
  schemas: SS,
  options?: TupleValidationOptions
) => TupleSchemaCore<SS>;

export const tuple: TupleSchemaCoreBuilder = <
  SS extends [SchemaCore<unknown>, ...SchemaCore<unknown>[]],
>(
  schemas: SS,
  options?: TupleValidationOptions
) => {
  const baseSchema = createTupleSchemaBase(schemas, options);
  const schema = createSchema('tuple', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as TupleSchemaCore<SS>;
};
