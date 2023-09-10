import type { SchemaCore } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';
import { refine } from './schema-extensions';

export const minItems = <E, S extends SchemaCore<E[]>>(
  schema: S & WithOpenApiMetadata<E[]>,
  min: number,
  message?: string | ((value: E[]) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.minItems = min;

  return refine(schema, (value) => value.length >= min, {
    code: 'too_small',
    message,
    minimum: min,
  });
};

export const maxItems = <E, S extends SchemaCore<E[]>>(
  schema: S & WithOpenApiMetadata<E[]>,
  max: number,
  message?: string | ((value: E[]) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.maxItems = max;

  return refine(schema, (value) => value.length <= max, {
    code: 'too_big',
    message,
    maximum: max,
  });
};
