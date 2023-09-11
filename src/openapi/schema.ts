export const OPEN_API_DATA_TYPE = [
  'string',
  'number',
  'integer',
  'boolean',
  'object',
  'array',
] as const;

export type OpenApiDataType = (typeof OPEN_API_DATA_TYPE)[number];

export type StringFormat = 'email' | 'uuid' | 'date' | 'date-time';

export type OpenApiSchema<T> = {
  type?: OpenApiDataType;
  nullable?: boolean;
  title?: string;
  description?: string;
  default?: T;
  example?: T;
  enum?: [...Exclude<T, null>[], T | null];
  format?: StringFormat;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
  properties?: { [key: string]: OpenApiSchema<unknown> };
  additionalProperties?: boolean | OpenApiSchema<unknown>;
  required?: string[];
  minProperties?: number;
  maxProperties?: number;
  readOnly?: boolean;
  writeOnly?: boolean;
  items?: OpenApiSchema<unknown> | OpenApiSchema<unknown>[];
  oneOf?: OpenApiSchema<unknown>[];
  allOf?: OpenApiSchema<unknown>[];
  minItems?: number;
  maxItems?: number;
  // uniqueItems?: boolean; // NOTE: Currently not supported by the library
};
