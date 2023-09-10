import type { SchemaCore } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';
import { refine } from './schema-extensions';

export const minLength = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  min: number,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.minLength = min;

  return refine(schema, (value: string) => value.length >= min, {
    code: 'too_small',
    message,
    minimum: min,
  });
};

export const maxLength = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  max: number,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.maxLength = max;

  return refine(schema, (value: string) => value.length <= max, {
    code: 'too_big',
    message,
    maximum: max,
  });
};

export const EMAIL_REGEX =
  /^(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_!#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$/;

export const email = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.format = 'email';

  return refine(schema, (value: string) => EMAIL_REGEX.test(value), {
    code: 'invalid_string',
    message,
    validation: 'email',
  });
};

// NOTE: This regular expression is compatible with UUID versions 1-5.
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export const uuid = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.format = 'uuid';

  return refine(schema, (value: string) => UUID_REGEX.test(value), {
    code: 'invalid_string',
    message,
    validation: 'uuid',
  });
};

// NOTE: This regular expression does not account for the varying number of days in each month or leap years.
export const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

export const date = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.format = 'date';

  return refine(schema, (value: string) => DATE_REGEX.test(value), {
    code: 'invalid_string',
    message,
    validation: 'date',
  });
};

// NOTE: This regular expression does not account for the varying number of days in each month or leap years.
export const DATE_TIME_REGEX =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.\d+)?([+-]([01][0-9]|2[0-3]):[0-5][0-9]|Z)$/;

export const dateTime = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.format = 'date-time';

  return refine(schema, (value: string) => DATE_TIME_REGEX.test(value), {
    code: 'invalid_string',
    message,
    validation: 'date-time',
  });
};

export const numeric = <S extends SchemaCore<string>>(
  schema: S,
  message?: string | ((value: string) => string)
): S => {
  return refine(schema, (value: string) => !isNaN(Number(value)), {
    code: 'invalid_string',
    message,
    validation: 'numeric',
  });
};

export const pattern = <S extends SchemaCore<string>>(
  schema: S & WithOpenApiMetadata<string>,
  regex: RegExp,
  message?: string | ((value: string) => string)
): S => {
  if (!schema._metadata) {
    schema._metadata = {};
  }
  schema._metadata.pattern = regex.source;

  return refine(schema, (value: string) => regex.test(value), {
    code: 'invalid_string',
    message,
    validation: 'regex',
  });
};
