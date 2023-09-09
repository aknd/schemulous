import type {
  Parse,
  ParseParams,
  SchemaContext,
  SchemaCore,
  SchemaType,
} from './core';
import { createSchema as createSchemaCore } from './core';
import type {
  Fallback,
  RefineParams,
  SafeParseError,
  SafeParseSuccess,
  SchemaMetadata,
  WithPrivateProps,
} from './extensions';
import {
  catchValue,
  defaultValue,
  meta,
  nullable,
  nullish,
  optional,
  parse,
  postprocess,
  preprocess,
  refine,
  safeParse,
} from './extensions';

export interface Schema<T> extends SchemaCore<T> {
  schemaType: SchemaType;
  optional<S extends Schema<T>>(this: S): S & Schema<T | undefined>;
  nullable<S extends Schema<T>>(this: S): S & Schema<T | null>;
  nullish<S extends Schema<T>>(this: S): S & Schema<T | null | undefined>;
  default<S extends Schema<T>>(this: S, def: T): S;
  catch<S extends Schema<T>>(this: S, fallback: Fallback<T>): S;
  preprocess<S extends Schema<T>>(this: S, process: (value: unknown) => T): S;
  refine<S extends Schema<T>>(
    this: S,
    check: (value: T) => boolean,
    params?: RefineParams<T> | ((value: T) => RefineParams<T>)
  ): S;
  postprocess<S extends Schema<T>>(this: S, process: (value: T) => T): S;
  meta<S extends Schema<T>>(this: S, metadata: SchemaMetadata<T>): S;
  parse: Parse<T>;
  safeParse(value: unknown): SafeParseSuccess<T> | SafeParseError;
}

export const createSchema = <T>(
  schemaType: SchemaType,
  baseParse: Parse<T>,
  ctx?: SchemaContext
): Schema<T> => {
  const schema = createSchemaCore<T>(
    schemaType,
    baseParse,
    ctx
  ) as SchemaCore<T> & Partial<Schema<T>> & WithPrivateProps<T>;

  schema.optional = function <S extends Schema<T>>(
    this: S
  ): S & Schema<T | undefined> {
    return optional(this);
  };

  schema.nullable = function <S extends Schema<T>>(
    this: S
  ): S & Schema<T | null> {
    return nullable(this);
  };

  schema.nullish = function <S extends Schema<T>>(
    this: S
  ): S & Schema<T | null | undefined> {
    return nullish(this);
  };

  schema.default = function <S extends Schema<T>>(this: S, def: T): S {
    return defaultValue(this, def);
  };

  schema.catch = function <S extends Schema<T>>(
    this: S,
    fallback: Fallback<T>
  ): S {
    return catchValue(this, fallback);
  };

  schema.preprocess = function <S extends Schema<T>>(
    this: S,
    process: (value: unknown) => T
  ): S {
    return preprocess(this, process);
  };

  schema.refine = function <S extends Schema<T>>(
    this: S,
    check: (value: T) => boolean,
    params?: RefineParams<T> | ((value: T) => RefineParams<T>)
  ): S {
    return refine(this, check, params);
  };

  schema.postprocess = function <S extends Schema<T>>(
    this: S,
    process: (value: T) => T
  ): S {
    return postprocess(this, process);
  };

  schema.meta = function <S extends Schema<T>>(
    this: S,
    metadata: SchemaMetadata<T>
  ): S {
    return meta(this, metadata);
  };

  schema.parse = function (value: unknown, params?: ParseParams): T {
    return parse(this, value, params);
  };

  schema.safeParse = function (
    value: unknown,
    params?: ParseParams
  ): SafeParseSuccess<T> | SafeParseError {
    return safeParse(this, value, params);
  };

  return schema as Schema<T>;
};
