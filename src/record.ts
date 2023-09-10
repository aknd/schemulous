import type { Infer, RecordSchemaCore, ValidationOptions } from './core';
import { createRecordSchemaBase } from './core';
import { maxProperties, minProperties } from './extensions';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface RecordSchema<VS extends Schema<Infer<VS>>>
  extends Schema<Record<string, Infer<VS>>>,
    RecordSchemaCore<VS> {
  minProperties(
    min: number,
    message?: string | ((value: Record<string, Infer<VS>>) => string)
  ): RecordSchema<VS>;
  maxProperties(
    max: number,
    message?: string | ((value: Record<string, Infer<VS>>) => string)
  ): RecordSchema<VS>;
}

export type RecordSchemaBuilder = <VS extends Schema<Infer<VS>>>(
  valueSchema: VS,
  options?: ValidationOptions
) => RecordSchema<VS>;

export const record: RecordSchemaBuilder = <VS extends Schema<Infer<VS>>>(
  valueSchema: VS,
  options?: ValidationOptions
) => {
  const baseSchema = createRecordSchemaBase<VS>(valueSchema, options);
  const schema = createSchema('record', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  }) as Schema<Record<string, Infer<VS>>> & Partial<RecordSchema<VS>>;
  Object.assign(schema, baseSchema);

  schema.minProperties = function (
    min: number,
    message?: string | ((value: Record<string, Infer<VS>>) => string)
  ): RecordSchema<VS> {
    return minProperties(this, min, message) as RecordSchema<VS>;
  };

  schema.maxProperties = function (
    max: number,
    message?: string | ((value: Record<string, Infer<VS>>) => string)
  ): RecordSchema<VS> {
    return maxProperties(this, max, message) as RecordSchema<VS>;
  };

  return schema as RecordSchema<VS>;
};
