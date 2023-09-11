import type { SchemaCore } from '../core';
import { pick } from '../helpers';

export type StringFormat = 'email' | 'uuid' | 'date' | 'date-time';

export type OpenApiMetadata<T> = {
  type?: string;
  title?: string;
  description?: string;
  example?: T;
  format?: StringFormat;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
  required?: string[];
  minProperties?: number;
  maxProperties?: number;
  readOnly?: boolean;
  writeOnly?: boolean;
  minItems?: number;
  maxItems?: number;
  // uniqueItems?: boolean; // NOTE: Currently not supported by the library
};

export type WithOpenApiMetadata<T> = {
  _metadata?: OpenApiMetadata<T>;
};

export const ALLOWED_METADATA_KEYS = [
  'title',
  'description',
  'example',
  'format',
  'readOnly',
  'writeOnly',
] as const;

export type AllowedMetadataKey = (typeof ALLOWED_METADATA_KEYS)[number];

export type SchemaMetadata<T> = Pick<OpenApiMetadata<T>, AllowedMetadataKey>;

export const meta = <T, S extends SchemaCore<T>>(
  schema: S & WithOpenApiMetadata<T>,
  metadata: SchemaMetadata<T>
): S => {
  const data = pick(metadata, ALLOWED_METADATA_KEYS);
  if (schema._metadata?.format) {
    delete data.format;
  }
  schema._metadata = schema._metadata ? { ...schema._metadata, ...data } : data;

  return schema as S;
};
