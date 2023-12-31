import type { EnumTypeSchemaCore, EnumTypeValidationOptions } from './core';
import { createEnumTypeSchemaBase } from './core';
import type { Schema } from './schema';
import { createSchema } from './schema';

export interface EnumTypeSchema<U extends readonly [string, ...string[]]>
  extends Schema<U[number]>,
    EnumTypeSchemaCore<U> {
  readonly enum: { readonly [K in U[number]]: K };
  options: readonly [...U];
}

export type EnumTypeSchemaBuilder = <U extends readonly [string, ...string[]]>(
  values: U,
  options?: EnumTypeValidationOptions
) => EnumTypeSchema<U>;

export const enumType: EnumTypeSchemaBuilder = <
  U extends readonly [string, ...string[]],
>(
  values: U,
  options?: EnumTypeValidationOptions
) => {
  const baseSchema = createEnumTypeSchemaBase(values, options);
  const schema = createSchema('enum', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  });
  Object.assign(schema, baseSchema);

  return schema as EnumTypeSchema<U>;
};
