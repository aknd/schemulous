import type { SchemaCore } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';
import { refine } from './schema-extensions';

export const int = (
  schema: SchemaCore<number> & WithOpenApiMetadata<number>,
  message?: string | ((value: number) => string)
): SchemaCore<number> => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.type = 'integer';

  return refine(schema, (value: number) => value % 1 === 0, {
    code: 'invalid_type',
    message,
    int: true,
  });
};

export const exclusive = <T>(
  schema: SchemaCore<T> & WithOpenApiMetadata<T>
): SchemaCore<T> => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  if (schema._metadata.minimum !== undefined) {
    schema._metadata.exclusiveMinimum = true;
  }
  if (schema._metadata.maximum !== undefined) {
    schema._metadata.exclusiveMaximum = true;
  }

  return schema;
};

export type WithExclusive = {
  exclusive(): SchemaCore<number>;
};

export const minimum = (
  schema: SchemaCore<number> & WithOpenApiMetadata<number>,
  min: number,
  message?: string | ((value: number) => string)
): SchemaCore<number> & WithExclusive => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.minimum = min;

  const isExclusive = (): boolean => !!schema._metadata?.exclusiveMinimum;

  const newSchema = refine(
    schema,
    (value: number) => (isExclusive() ? value > min : value >= min),
    () => ({
      code: 'too_small',
      ...(!isExclusive() && { inclusive: true }),
      message,
      minimum: min,
    })
  ) as SchemaCore<number> & Partial<WithExclusive>;

  newSchema.exclusive = function (): SchemaCore<number> {
    return exclusive(this);
  };

  return newSchema as SchemaCore<number> & WithExclusive;
};

export const maximum = (
  schema: SchemaCore<number> & WithOpenApiMetadata<number>,
  max: number,
  message?: string | ((value: number) => string)
): SchemaCore<number> & WithExclusive => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.maximum = max;

  const isExclusive = (): boolean => !!schema._metadata?.exclusiveMaximum;

  const newSchema = refine(
    schema,
    (value: number) => (isExclusive() ? value < max : value <= max),
    () => ({
      code: 'too_big',
      ...(!isExclusive() && { inclusive: true }),
      message,
      maximum: max,
    })
  ) as SchemaCore<number> & Partial<WithExclusive>;

  newSchema.exclusive = function (): SchemaCore<number> {
    return exclusive(this);
  };

  return newSchema as SchemaCore<number> & WithExclusive;
};

export const multipleOf = (
  schema: SchemaCore<number> & WithOpenApiMetadata<number>,
  multiple: number,
  message?: string | ((value: number) => string)
): SchemaCore<number> => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.multipleOf = multiple;

  return refine(schema, (value: number) => value % multiple === 0, {
    code: 'not_multiple_of',
    message,
    multipleOf: multiple,
  });
};
