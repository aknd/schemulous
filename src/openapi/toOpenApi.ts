import type {
  ArraySchemaCore,
  EnumTypeSchemaCore,
  IntersectionSchemaCore,
  LiteralSchemaCore,
  ObjectSchemaCore,
  RecordSchemaCore,
  SchemaCore,
  TupleSchemaCore,
  UnionSchemaCore,
} from '../core';
import type { WithObjectSchemaEx, WithPrivateProps } from '../extensions';
import { OpenApiError } from './errors';
import { getType } from '../helpers';

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

export const OAS_IMCOMPATIBLE_TYPES = [
  'symbol',
  'undefined',
  'date',
  'any',
  'custom',
] as const;

export const toOpenApi = <T>(
  schema: SchemaCore<T> & WithPrivateProps<T>,
  path?: (string | number)[] // NOTE: for error reporting
): OpenApiSchema<T> => {
  if (OAS_IMCOMPATIBLE_TYPES.some((t) => schema.schemaType === t)) {
    throw new OpenApiError(
      `The schema contains a type: '${schema.schemaType}' that is not compatible with OpenAPI specifications.`,
      path
    );
  }

  const openApiSchema: OpenApiSchema<T> = {
    ...schema._metadata,
  };

  if (schema._nullable) {
    openApiSchema.nullable = true;
  }

  if (schema._default) {
    openApiSchema.default = schema._default;
  }

  if (schema.schemaType === 'null') {
    openApiSchema.enum = [null];
  }

  let type: string = openApiSchema.type || schema.schemaType;

  if (schema.schemaType === 'literal') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const literalSchema = schema as LiteralSchemaCore<any>;
    const literalValue = literalSchema.value;
    if (literalValue === undefined) {
      throw new OpenApiError(
        "Literal schema with the value 'undefined' is not compatible with OpenAPI specifications.",
        path
      );
    }
    if (Number.isNaN(literalValue)) {
      throw new OpenApiError(
        "Literal schema with the value 'NaN' is not compatible with OpenAPI specifications.",
        path
      );
    }

    type = getType(literalValue);

    openApiSchema.enum = [literalValue];
    if (literalValue !== null && schema._nullable) {
      openApiSchema.enum.push(null);
    }
  }

  if (schema.schemaType === 'enum') {
    // TODO: native enum
    type = 'string';

    const enumTypeSchema = schema as unknown as EnumTypeSchemaCore<
      [string, ...string[]]
    >;
    openApiSchema.enum = enumTypeSchema.options as unknown as [
      ...Exclude<T, null>[],
      T,
    ];
    if (schema._nullable) {
      openApiSchema.enum.push(null);
    }
  }

  if (schema.schemaType === 'object') {
    const objectSchema = schema as ObjectSchemaCore<T> & WithObjectSchemaEx;
    openApiSchema.properties = {};
    for (const key in objectSchema.shape) {
      if (!Object.prototype.hasOwnProperty.call(objectSchema.shape, key)) {
        continue;
      }

      const propSchema = objectSchema.shape[key];
      const propPath = [...(path ?? []), key];
      openApiSchema.properties[key] = toOpenApi(
        propSchema as SchemaCore<T>,
        propPath
      );
    }

    if (objectSchema._strict) {
      openApiSchema.additionalProperties = false;
    }
  }

  if (schema.schemaType === 'array') {
    const arraySchema = schema as unknown as ArraySchemaCore<T>;
    const elementSchema = arraySchema.element;
    openApiSchema.items = toOpenApi(elementSchema as SchemaCore<T>, path);
  }

  if (type === 'record') {
    type = 'object';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recordSchema = schema as RecordSchemaCore<any>;
    openApiSchema.additionalProperties = toOpenApi(
      recordSchema.valueSchema,
      path
    );
  }

  if (type === 'tuple') {
    type = 'array';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tupleSchema = schema as unknown as TupleSchemaCore<any>;
    openApiSchema.items = tupleSchema.elements.map((e, i) => {
      return toOpenApi(e, [...(path ?? []), i]);
    });
    openApiSchema.minItems = tupleSchema.elements.length;
    openApiSchema.maxItems = tupleSchema.elements.length;
  }

  if (schema.schemaType === 'intersection') {
    type = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const intersectionSchema = schema as IntersectionSchemaCore<any>;
    openApiSchema.allOf = intersectionSchema.schemas.map((s, i) => {
      return toOpenApi(s, [...(path ?? []), i]);
    });
  }

  if (schema.schemaType === 'union') {
    type = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unionSchema = schema as UnionSchemaCore<any>;
    openApiSchema.oneOf = unionSchema.schemas.map((s, i) => {
      return toOpenApi(s, [...(path ?? []), i]);
    });
  }

  if (type && OPEN_API_DATA_TYPE.some((t) => t === type)) {
    openApiSchema.type = type as OpenApiDataType;
  }

  return openApiSchema;
};
