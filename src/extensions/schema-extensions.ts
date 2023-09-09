import type {
  CreateValidationIssueParams,
  ParseParams,
  SchemaCore,
  SchemaType,
  ValidationIssue,
} from '../core';
import { ValidationError, createValidationIssue } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';

export type WithOptional = {
  _optional?: true;
};

export const optional = <T, S extends SchemaCore<T>>(
  schema: S & WithOptional
): S & SchemaCore<T | undefined> => {
  schema._optional = true;

  return schema as S & SchemaCore<T | undefined>;
};

export type WithNullable = {
  _nullable?: true;
};

export const nullable = <T, S extends SchemaCore<T>>(
  schema: S & WithNullable
): S & SchemaCore<T | null> => {
  schema._nullable = true;

  return schema as S & SchemaCore<T | null>;
};

export const nullish = <T, S extends SchemaCore<T>>(
  schema: S & WithOptional & WithNullable
): S & SchemaCore<T | null | undefined> => {
  schema._optional = true;
  schema._nullable = true;

  return schema as S & SchemaCore<T | null | undefined>;
};

export type WithDefaultValue<T> = {
  _default?: T;
};

export const defaultValue = <T, S extends SchemaCore<T>>(
  schema: S & WithDefaultValue<T>,
  def: T
): S => {
  schema._default = def;

  return schema;
};

export type Fallback<T> = T extends (...args: unknown[]) => unknown
  ? never
  : T | (() => T);

export type WithCatchValue<T> = {
  _fallback?: Fallback<T>;
};

export const catchValue = <T, S extends SchemaCore<T>>(
  schema: S & WithCatchValue<T>,
  fallback: Fallback<T>
): S => {
  schema._fallback = fallback;

  return schema;
};

export type WithPreprocesses<T> = {
  _preprocesses?: ((value: unknown) => T)[];
};

export const preprocess = <T, S extends SchemaCore<T>>(
  schema: S & WithPreprocesses<T>,
  process: (value: unknown) => T
): S => {
  if (!schema._preprocesses) {
    schema._preprocesses = [];
  }
  schema._preprocesses.push(process);

  return schema;
};

export type WithRefinements<T> = {
  _refinements?: ((
    value: T,
    schemaType: SchemaType,
    path?: (string | number)[]
  ) => boolean)[];
};

export type RefineParams<T> = {
  message?: string | ((value: T) => string);
} & Partial<
  Omit<CreateValidationIssueParams, 'schemaType' | 'value' | 'message'>
>;

export type WithIssues = {
  _issues?: ValidationIssue[];
};

export const refine = <T, S extends SchemaCore<T>>(
  schema: S & WithIssues & WithRefinements<T>,
  check: (value: T) => boolean,
  params?: RefineParams<T> | ((value: T) => RefineParams<T>)
): S => {
  const refinement = (
    value: T,
    schemaType: SchemaType,
    path?: (string | number)[]
  ): boolean => {
    const isValid = check(value);
    if (!isValid) {
      if (!schema._issues) {
        schema._issues = [];
      }
      if (typeof params === 'function') {
        params = params(value);
      }
      const errorPath = path ?? [];
      if (params?.path) {
        errorPath.push(...params.path);
      }
      const issue = createValidationIssue({
        ...params,
        schemaType: schemaType,
        code: params?.code || 'custom',
        value,
        path: errorPath,
      });
      schema._issues.push(issue);
    }

    return isValid;
  };

  if (!schema._refinements) {
    schema._refinements = [];
  }
  schema._refinements.push(refinement);

  return schema;
};

export type WithPostprocesses<T> = {
  _postprocesses?: ((value: T) => T)[];
};

export const postprocess = <T, S extends SchemaCore<T>>(
  schema: S & WithPostprocesses<T>,
  process: (value: T) => T
): S => {
  if (!schema._postprocesses) {
    schema._postprocesses = [];
  }
  schema._postprocesses.push(process);

  return schema;
};

export type WithPrivateProps<T> = WithIssues &
  WithOptional &
  WithNullable &
  WithDefaultValue<T> &
  WithCatchValue<T> &
  WithPreprocesses<T> &
  WithRefinements<T> &
  WithPostprocesses<T> &
  WithOpenApiMetadata<T>;

export const parse = <T>(
  schema: SchemaCore<T> & WithPrivateProps<T>,
  value: unknown,
  params?: ParseParams
): T => {
  if (value === undefined && schema._default) return schema._default as T;
  if (value === undefined && schema._optional) return value as T;
  if (value === null && schema._nullable) return value as T;

  for (const preprocess of schema._preprocesses ?? []) {
    value = preprocess(value);
  }

  let result: T | undefined;

  try {
    result = schema.baseParse(value, params);
  } catch (err) {
    if (schema._fallback !== undefined) {
      const fallbackValue =
        typeof schema._fallback === 'function'
          ? schema._fallback()
          : schema._fallback;

      return fallbackValue as T;
    }

    throw err;
  }

  for (const postprocess of schema._postprocesses ?? []) {
    result = postprocess(result);
  }

  for (const refinement of schema._refinements ?? []) {
    const isValid = refinement(result, schema.schemaType, params?.path);
    if (!isValid && schema._fallback !== undefined) {
      const fallbackValue =
        typeof schema._fallback === 'function'
          ? schema._fallback()
          : schema._fallback;

      return fallbackValue as T;
    }
    if (!isValid && schema.ctx?.abortEarly) {
      break;
    }
  }

  if (schema._issues?.length) {
    const error = new ValidationError(schema._issues);
    delete schema._issues;
    throw error;
  }

  return result as T;
};

export type SafeParseSuccess<T> = {
  success: true;
  data: T;
};

export type SafeParseError = {
  success: false;
  error: ValidationError;
};

export const safeParse = <T>(
  schema: SchemaCore<T> & WithPrivateProps<T>,
  value: unknown,
  params?: ParseParams
): SafeParseSuccess<T> | SafeParseError => {
  try {
    const data = parse(schema, value, params);

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error,
      };
    }

    throw error;
  }
};
