import type { SchemaCore } from '../core';

export type WithObjectSchemaEx = {
  _passthrough?: boolean;
  _strict?: boolean;
  _strictMessage?: string | ((value: unknown) => string);
};

export const passthrough = <T, S extends SchemaCore<T>>(
  schema: S & WithObjectSchemaEx
): S & SchemaCore<T & { [k: string]: unknown }> => {
  schema._passthrough = true;
  delete schema._strict;
  delete schema._strictMessage;

  return schema as S & SchemaCore<T & { [k: string]: unknown }>;
};

export const strict = <T, S extends SchemaCore<T>>(
  schema: S & WithObjectSchemaEx,
  message?: string
): S => {
  schema._strict = true;
  schema._strictMessage = message;
  delete schema._passthrough;

  return schema as S;
};
