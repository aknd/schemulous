import type { SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import type {
  WithObjectSchemaEx,
  WithOpenApiMetadata,
  WithOptional,
} from '../extensions';
import { parse } from '../extensions';
import type { ValidationIssue } from './errors';
import { ValidationError, createValidationIssue } from './errors';
import { safeParsePlainObject } from '../helpers';

export type ShapeCore<T> = {
  [K in keyof T]: SchemaCore<T[K]>;
  // NOTE: Distinguishing between 'RecordSchemaCore' and 'ObjectSchemaCore' can be challenging due to their structural similarities.
  // [K in keyof T]: T[K] extends { [key: string]: unknown }
  //   ? ObjectSchemaCore<T[K]>
  //   : T[K] extends unknown[]
  //   ? ArraySchemaCore<T[K][number]>
  //   : Schema<T[K]>;
};

export interface ObjectSchemaCore<T> extends SchemaCore<T> {
  readonly shape: ShapeCore<T>;
}

export const createObjectSchemaBase = <T>(
  shape: ShapeCore<T>,
  options?: ValidationOptions
): Pick<ObjectSchemaCore<T>, 'baseParse' | 'shape'> => {
  const schema = { shape } as Partial<ObjectSchemaCore<T>> &
    WithObjectSchemaEx &
    WithOpenApiMetadata<T>;

  schema._metadata = {};
  for (const key in shape) {
    const valueSchema = shape[key] as ShapeCore<T>[Extract<keyof T, string>] &
      WithOptional;
    if (!valueSchema._optional) {
      if (!schema._metadata.required) {
        schema._metadata.required = [];
      }
      schema._metadata.required.push(key);
    }
  }

  schema.baseParse = function (value, params): T {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'object',
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
        schemaType: 'object',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    const result: { [K in keyof T]?: unknown } = {};
    const issues: ValidationIssue[] = [];

    const unparsedKeys = new Set(Object.keys(safeParsedObj));

    for (const key in shape) {
      try {
        const valueSchema = shape[key];
        result[key] = parse(valueSchema, safeParsedObj[key], {
          ...params,
          path: [...(params?.path ?? []), key],
        });
      } catch (err) {
        if (err instanceof ValidationError) {
          issues.push(...err.issues);
          if (options?.abortEarly) {
            throw new ValidationError(issues);
          }
        } else {
          throw err;
        }
      } finally {
        unparsedKeys.delete(key);
      }
    }

    if (unparsedKeys.size > 0 && this._strict) {
      const issue = createValidationIssue({
        schemaType: 'object',
        code: 'unrecognized_keys',
        value: safeParsedObj,
        keys: [...unparsedKeys],
        message: this._strictMessage,
        path: params?.path,
      });
      issues.push(issue);
    }

    if (issues.length > 0) {
      throw new ValidationError(issues);
    }

    if (unparsedKeys.size > 0 && this._passthrough) {
      for (const key of unparsedKeys) {
        (result as { [key: string]: unknown })[key] = safeParsedObj[key];
      }
    }

    return result as T;
  };

  return schema as Pick<ObjectSchemaCore<T>, 'baseParse' | 'shape'>;
};

export type ObjectSchemaCoreBuilder = <T>(
  shape: ShapeCore<T>,
  options?: ValidationOptions
) => ObjectSchemaCore<T>;

export const object: ObjectSchemaCoreBuilder = <T>(
  shape: ShapeCore<T>,
  options?: ValidationOptions
) => {
  const schemaBase = createObjectSchemaBase<T>(shape, options);
  const schema = createSchema<T>('object', schemaBase.baseParse, {
    abortEarly: options?.abortEarly,
  }) as SchemaCore<T> & Partial<ObjectSchemaCore<T>> & WithOpenApiMetadata<T>;
  Object.assign(schema, schemaBase);

  return schema as ObjectSchemaCore<T>;
};
