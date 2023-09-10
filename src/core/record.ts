import type { Infer, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { parse } from '../extensions';
import type { ValidationIssue } from './errors';
import { ValidationError, createValidationIssue } from './errors';
import { safeParsePlainObject } from '../helpers';

export interface RecordSchemaCore<VS extends SchemaCore<Infer<VS>>>
  extends SchemaCore<Record<string, Infer<VS>>> {
  readonly valueSchema: VS;
}

export const createRecordSchemaBase = <VS extends SchemaCore<Infer<VS>>>(
  valueSchema: VS,
  options?: ValidationOptions
): Pick<RecordSchemaCore<VS>, 'baseParse' | 'valueSchema'> => {
  const schema = { valueSchema } as Partial<RecordSchemaCore<VS>>;

  schema.baseParse = (value, params): Record<string, Infer<VS>> => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'record',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    const safeParsedObj = safeParsePlainObject(value);
    if (!safeParsedObj) {
      const issue = createValidationIssue({
        schemaType: 'record',
        code: 'invalid_type',
        value: value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    const result: Record<string, Infer<VS>> = {};
    const issues: ValidationIssue[] = [];

    for (const [key, val] of Object.entries(safeParsedObj)) {
      if (key === '__proto__') continue;

      const path = [...(params?.path ?? []), key];
      let parsedValue: Infer<typeof valueSchema> | undefined;
      try {
        parsedValue = parse(valueSchema, val, { path }) as Infer<
          typeof valueSchema
        >;
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

      result[key] = parsedValue as Infer<typeof valueSchema>;
    }

    if (issues.length > 0) {
      throw new ValidationError(issues);
    }

    return result;
  };

  return schema as Pick<RecordSchemaCore<VS>, 'baseParse' | 'valueSchema'>;
};

export type RecordSchemaCoreBuilder = <VS extends SchemaCore<Infer<VS>>>(
  valueSchema: VS,
  options?: ValidationOptions
) => RecordSchemaCore<VS>;

export const record: RecordSchemaCoreBuilder = <
  VS extends SchemaCore<Infer<VS>>,
>(
  valueSchema: VS,
  options?: ValidationOptions
) => {
  const baseSchema = createRecordSchemaBase(valueSchema, options);
  const schema = createSchema('record', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as RecordSchemaCore<VS>;
};
