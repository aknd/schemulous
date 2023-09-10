import type { SchemaCore, ValidationOptions } from './core';
import { createStringParse } from './core';
import {
  date,
  dateTime,
  email,
  maxLength,
  minLength,
  numeric,
  pattern,
  uuid,
} from './extensions';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface StringSchema extends Schema<string>, SchemaCore<string> {
  minLength(
    min: number,
    message?: string | ((value: string) => string)
  ): StringSchema;
  maxLength(
    max: number,
    message?: string | ((value: string) => string)
  ): StringSchema;
  email(message?: string | ((value: string) => string)): StringSchema;
  uuid(message?: string | ((value: string) => string)): StringSchema;
  date(message?: string | ((value: string) => string)): StringSchema;
  dateTime(message?: string | ((value: string) => string)): StringSchema;
  numeric(message?: string | ((value: string) => string)): StringSchema;
  pattern(
    regex: RegExp,
    message?: string | ((value: string) => string)
  ): StringSchema;
  // TODO: implement postprocess extensions
  // coerce: (
  //   coercer: (value: unknown) => string | ((value: string) => string)
  // ) => StringSchema;
  // trim: () => StringSchema;
  // toLowerCase: () => StringSchema;
  // toUpperCase: () => StringSchema;
}

export type StringSchemaBuilder = (options?: ValidationOptions) => StringSchema;

export const string: StringSchemaBuilder = (options) => {
  const baseParse = createStringParse(options);
  const schema = createSchema('string', baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<string> & Partial<StringSchema>;

  schema.minLength = function (
    min: number,
    message?: string | ((value: string) => string)
  ): StringSchema {
    return minLength(this, min, message) as StringSchema;
  };

  schema.maxLength = function (
    max: number,
    message?: string | ((value: string) => string)
  ): StringSchema {
    return maxLength(this, max, message) as StringSchema;
  };

  schema.email = function (
    message?: string | ((value: string) => string)
  ): StringSchema {
    return email(this, message) as StringSchema;
  };

  schema.uuid = function (
    message?: string | ((value: string) => string)
  ): StringSchema {
    return uuid(this, message) as StringSchema;
  };

  schema.date = function (
    message?: string | ((value: string) => string)
  ): StringSchema {
    return date(this, message) as StringSchema;
  };

  schema.dateTime = function (
    message?: string | ((value: string) => string)
  ): StringSchema {
    return dateTime(this, message) as StringSchema;
  };

  schema.numeric = function (
    message?: string | ((value: string) => string)
  ): StringSchema {
    return numeric(this, message) as StringSchema;
  };

  schema.pattern = function (
    regex: RegExp,
    message?: string | ((value: string) => string)
  ): StringSchema {
    return pattern(this, regex, message) as StringSchema;
  };

  return schema as StringSchema;
};
