import type { ValidationOptions } from './core';
import { createDateParse } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface DateSchema extends Schema<Date> {}

export type DateSchemaBuilder = (options?: ValidationOptions) => DateSchema;

export const date: DateSchemaBuilder = (options) => {
  const baseParse = createDateParse(options);
  const schema = createSchema('date', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
