import type { SchemaType } from './schema';
import { capitalize, getType } from '../helpers';

export type ValidationIssueCode =
  | 'required'
  | 'invalid_type'
  | 'invalid_enum_value'
  | 'unrecognized_keys'
  | 'invalid_literal'
  | 'invalid_union'
  | 'invalid_string'
  | 'too_small'
  | 'too_big'
  | 'not_multiple_of'
  | 'custom';

export type StringValidationType =
  | 'email'
  | 'uuid'
  | 'date'
  | 'date-time'
  | 'numeric'
  | 'regex';

export type ValidationIssue = {
  code: ValidationIssueCode | string;
  expected?: unknown;
  keys?: string[];
  inclusive?: boolean;
  message: string;
  options?: readonly string[];
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  path: (string | number)[];
  received?: unknown;
  type?: string;
  validation?: StringValidationType;
};

export class ValidationError extends Error {
  issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    super();
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

export type CreateValidationIssueParams = {
  schemaType: SchemaType;
  code: ValidationIssueCode;
  value: unknown;
  keys?: string[];
  inclusive?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message?: string | ((value: any) => string);
  int?: boolean;
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  options?: readonly string[];
  literal?: unknown;
  path?: (string | number)[];
  validation?: StringValidationType;
};

export const createValidationIssue = ({
  schemaType,
  code,
  value,
  keys,
  inclusive,
  message,
  int,
  minimum,
  maximum,
  multipleOf,
  options,
  literal,
  path = [],
  validation,
}: CreateValidationIssueParams): ValidationIssue => {
  let expectedType: string = schemaType;
  if (schemaType === 'number' && int) {
    expectedType = 'integer';
  }
  if (schemaType === 'record') {
    expectedType = 'object';
  }
  if (schemaType === 'tuple') {
    expectedType = 'array';
  }

  let receivedType = getType(value);
  if (receivedType === 'number' && Number.isNaN(value)) {
    receivedType = 'nan';
  }
  if (receivedType === 'number' && int) {
    receivedType = Number(value) % 1 !== 0 ? 'double' : 'integer';
  }

  let expected: unknown;
  if (code === 'invalid_type') {
    expected = expectedType;
  }
  if (code === 'invalid_literal') {
    expected = literal;
  }

  let msg = typeof message === 'function' ? message(value) : message;
  let type: string | undefined;
  if (!msg) {
    msg = 'Invalid input';
    if (code === 'required') {
      msg = 'Required';
    }
    if (code === 'invalid_type') {
      msg = `Expected ${expectedType}, received ${receivedType}`;
    }
    if (code === 'invalid_enum_value' && options?.length) {
      msg = `Invalid enum value. Expected ${options
        ?.map((v) => `'${v}'`)
        .join(' | ')}, received ${value}`;
    }
    if (code === 'unrecognized_keys' && keys?.length) {
      msg = `Unrecognized key(s) in object: ${keys
        ?.map((k) => `'${k}'`)
        .join(', ')}`;
    }
    if (code === 'invalid_literal') {
      msg = `Invalid literal value, expected ${
        typeof literal === 'string' ? `'${literal}'` : literal
      }`;
    }
    if (code === 'invalid_string') {
      msg = `Invalid${
        validation && validation !== 'regex' ? ` ${validation}` : ''
      }`;
    }
    if (code === 'too_small' && minimum !== undefined) {
      type = receivedType;
      if (type === 'array' || type === 'string') {
        inclusive = true;
        msg = `${capitalize(type)} must contain at least ${minimum} ${
          type === 'array' ? 'element' : 'character'
        }(s)`;
      }
      if (type === 'object') {
        inclusive = true;
        msg = `Object must contain at least ${minimum} key(s)`;
      }
      if (type === 'number') {
        inclusive = inclusive ?? false;
        msg = `${capitalize(type)} must be greater than${
          inclusive ? ' or equal to' : ''
        } ${minimum}`;
      }
    }
    if (code === 'too_big' && maximum !== undefined) {
      type = receivedType;
      if (type === 'array' || type === 'string') {
        inclusive = true;
        msg = `${capitalize(type)} must contain at most ${maximum} ${
          type === 'array' ? 'element' : 'character'
        }(s)`;
      }
      if (type === 'object') {
        inclusive = true;
        msg = `Object must contain at most ${maximum} key(s)`;
      }
      if (type === 'number') {
        inclusive = inclusive ?? false;
        msg = `${capitalize(type)} must be less than${
          inclusive ? ' or equal to' : ''
        } ${maximum}`;
      }
    }
    if (code === 'not_multiple_of' && multipleOf !== undefined) {
      msg = `Number must be a multiple of ${multipleOf}`;
    }
  }

  let received: unknown;
  if (code === 'invalid_type') {
    received = receivedType;
  }
  if (code === 'invalid_enum_value' || code === 'invalid_literal') {
    received = value;
  }

  return {
    code,
    ...(expected !== undefined && { expected }),
    ...(keys?.length && { keys }),
    ...(inclusive !== undefined && { inclusive }),
    message: msg,
    ...(options?.length && { options }),
    ...(minimum !== undefined && { minimum }),
    ...(maximum !== undefined && { maximum }),
    ...(multipleOf !== undefined && { multipleOf }),
    path,
    ...(received !== undefined && { received }),
    ...(type && { type }),
    ...(validation && { validation }),
  };
};
