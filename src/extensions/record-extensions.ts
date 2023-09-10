import type { Infer, SchemaCore } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';
import { refine } from './schema-extensions';

export const minProperties = <
  VS,
  S extends SchemaCore<Record<string, Infer<VS>>>,
>(
  schema: S & WithOpenApiMetadata<Record<string, Infer<VS>>>,
  min: number,
  message?: string | ((value: Record<string, Infer<VS>>) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.minProperties = min;

  return refine(
    schema,
    (value: Record<string, unknown>) => Object.keys(value).length >= min,
    {
      code: 'too_small',
      message,
      minimum: min,
    }
  );
};

export const maxProperties = <
  VS,
  S extends SchemaCore<Record<string, Infer<VS>>>,
>(
  schema: S & WithOpenApiMetadata<Record<string, Infer<VS>>>,
  max: number,
  message?: string | ((value: Record<string, Infer<VS>>) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.maxProperties = max;

  return refine(
    schema,
    (value: Record<string, unknown>) => Object.keys(value).length <= max,
    {
      code: 'too_big',
      message,
      maximum: max,
    }
  );
};
