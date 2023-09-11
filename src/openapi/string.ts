import type { SchemaCore } from '../core';
import { string as stringCore } from '../core';
import {
  date,
  dateTime,
  email,
  maxLength,
  minLength,
  pattern,
  uuid,
} from '../extensions';
import type { OpenApiSchema } from './schema';

// TODO: Custom error messages
// TODO: Common schema extensions
export const string = (
  openApiSchema: OpenApiSchema<string>
): SchemaCore<string> => {
  const schema = stringCore();

  if (openApiSchema.pattern) {
    pattern(schema, new RegExp(openApiSchema.pattern));
  }
  if (openApiSchema.minLength !== undefined) {
    minLength(schema, openApiSchema.minLength);
  }
  if (openApiSchema.maxLength !== undefined) {
    maxLength(schema, openApiSchema.maxLength);
  }

  if (openApiSchema.format) {
    if (openApiSchema.format === 'email') {
      email(schema);
    }
    if (openApiSchema.format === 'uuid') {
      uuid(schema);
    }
    if (openApiSchema.format === 'date') {
      date(schema);
    }
    if (openApiSchema.format === 'date-time') {
      dateTime(schema);
    }
  }

  return schema;
};
