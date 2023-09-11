import type { SchemaCore } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';
import { refine } from './schema-extensions';

export const int = <S extends SchemaCore<number>>(
  schema: S & WithOpenApiMetadata<number>,
  message?: string | ((value: number) => string)
): S => {
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

export const exclusive = <S extends SchemaCore<number>>(
  schema: S & WithOpenApiMetadata<number>
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  if (schema._metadata.minimum !== undefined) {
    schema._metadata.exclusiveMinimum = true;
  }
  if (schema._metadata.maximum !== undefined) {
    schema._metadata.exclusiveMaximum = true;
  }

  return schema as S;
};

export type WithExclusive<S extends SchemaCore<number>> = {
  exclusive(): S;
};

export const minimum = <S extends SchemaCore<number>>(
  schema: S & WithOpenApiMetadata<number>,
  min: number,
  message?: string | ((value: number) => string)
): S & WithExclusive<S> => {
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
  ) as S & Partial<WithExclusive<S>>;

  newSchema.exclusive = function (): S {
    return exclusive(this);
  };

  return newSchema as S & WithExclusive<S>;
};

export const maximum = <S extends SchemaCore<number>>(
  schema: S & WithOpenApiMetadata<number>,
  max: number,
  message?: string | ((value: number) => string)
): S & WithExclusive<S> => {
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
  ) as S & Partial<WithExclusive<S>>;

  newSchema.exclusive = function (): S {
    return exclusive(this);
  };

  return newSchema as S & WithExclusive<S>;
};

export const multipleOf = <S extends SchemaCore<number>>(
  schema: S & WithOpenApiMetadata<number>,
  multiple: number,
  message?: string | ((value: number) => string)
): S => {
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
