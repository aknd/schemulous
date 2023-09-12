import type {
  CreateValidationIssueParams,
  ElementSchemaCore,
  SchemaCore,
  SchemaType,
  ShapeCore,
  ValidationIssue,
} from '../core';
import { createValidationIssue } from '../core';
import type { WithOpenApiMetadata } from './openapi-extensions';
import { plainDeepCopy } from '../helpers';

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
  _default?: Readonly<T>;
};

export const defaultValue = <T, S extends SchemaCore<T>>(
  schema: S & WithDefaultValue<T>,
  def: Readonly<T>
): S => {
  schema._default = def;

  return schema as S;
};

export type Fallback<T> = T extends (...args: unknown[]) => unknown
  ? never
  : Readonly<T> | (() => Readonly<T>);

export type WithCatchValue<T> = {
  _fallback?: Fallback<T>;
};

export const catchValue = <T, S extends SchemaCore<T>>(
  schema: S & WithCatchValue<T>,
  fallback: Fallback<T>
): S => {
  schema._fallback = fallback;

  return schema as S;
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

  return schema as S;
};

export type WithRefinements<T> = {
  _refinements?: ((
    currentSchema: SchemaCore<T>,
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
    currentSchema: SchemaCore<T> & WithIssues & WithRefinements<T>,
    value: T,
    schemaType: SchemaType,
    path?: (string | number)[]
  ): boolean => {
    const isValid = check(value);
    if (!isValid) {
      if (!currentSchema._issues) {
        currentSchema._issues = [];
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
      currentSchema._issues.push(issue);
    }

    return isValid;
  };

  if (!schema._refinements) {
    schema._refinements = [];
  }
  schema._refinements.push(refinement);

  return schema as S;
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

  return schema as S;
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

export type Writable<T> = { -readonly [K in keyof T]: T[K] };

export const copy = <T, S extends SchemaCore<T>>(
  schema: S & WithPrivateProps<T>
): S => {
  const copiedSchema = { ...schema };
  copiedSchema._issues = undefined;
  copiedSchema._preprocesses = schema._preprocesses?.slice();
  copiedSchema._refinements = schema._refinements?.slice();
  copiedSchema._postprocesses = schema._postprocesses?.slice();
  copiedSchema._metadata = plainDeepCopy(schema._metadata);

  if (schema.schemaType === 'object') {
    const cs = copiedSchema as SchemaCore<T> & {
      shape?: Writable<ShapeCore<T>>;
    };
    for (const key in cs.shape ?? {}) {
      if (cs.shape?.hasOwnProperty(key)) {
        const k = key as keyof T;
        cs.shape[k] = copy(cs.shape[k]);
      }
    }
  }
  if (schema.schemaType === 'array') {
    const cs = copiedSchema as SchemaCore<T> & {
      element?: ElementSchemaCore<T>;
    };
    if (cs.element) {
      cs.element = copy(cs.element);
    }
  }
  if (schema.schemaType === 'record') {
    const cs = copiedSchema as SchemaCore<T> & {
      valueSchema?: SchemaCore<Record<string, unknown>>;
    };
    if (cs.valueSchema) {
      cs.valueSchema = copy(cs.valueSchema);
    }
  }
  if (schema.schemaType === 'tuple') {
    const cs = copiedSchema as SchemaCore<T> & {
      elements?: SchemaCore<unknown>[];
    };
    if (cs.elements) {
      cs.elements = cs.elements.map((e) => copy(e));
    }
  }
  if (schema.schemaType === 'intersection') {
    const cs = copiedSchema as SchemaCore<T> & {
      schemas?: SchemaCore<unknown>[];
    };
    if (cs.schemas) {
      cs.schemas = cs.schemas.map((s) => copy(s));
    }
  }
  if (schema.schemaType === 'union') {
    const cs = copiedSchema as SchemaCore<T> & {
      schemas?: SchemaCore<unknown>[];
    };
    if (cs.schemas) {
      cs.schemas = cs.schemas.map((s) => copy(s));
    }
  }

  return copiedSchema as S;
};
