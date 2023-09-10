import type { SchemaCore } from '../core';

export type WithObjectSchemaEx = {
  _passthrough?: boolean;
  _strict?: boolean;
  _strictMessage?: string | ((value: unknown) => string);
};

export const passthrough = <T>(
  schema: SchemaCore<T> & WithObjectSchemaEx
): SchemaCore<T & { [k: string]: unknown }> => {
  schema._passthrough = true;
  delete schema._strict;
  delete schema._strictMessage;

  return schema as SchemaCore<T & { [k: string]: unknown }>;
};

export const strict = <T>(
  schema: SchemaCore<T> & WithObjectSchemaEx,
  message?: string
): SchemaCore<T> => {
  schema._strict = true;
  schema._strictMessage = message;
  delete schema._passthrough;

  return schema;
};
