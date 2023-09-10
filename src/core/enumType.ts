import type { Parse, SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export type EnumValidationOptions = ValidationOptions & {
  invalid_enum_value_error?: string | ((value: string) => string);
};

export const createEnumTypeParse =
  <U extends readonly [string, ...string[]]>(
    values: U,
    options?: EnumValidationOptions
  ): Parse<U[number]> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'enum',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (typeof value !== 'string') {
      const issue = createValidationIssue({
        schemaType: 'enum',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (!values.some((v) => v === value)) {
      const issue = createValidationIssue({
        schemaType: 'enum',
        code: 'invalid_enum_value',
        value,
        message: options?.invalid_enum_value_error,
        options: values,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value as U[number];
  };

export interface EnumSchemaCore<U extends readonly [string, ...string[]]>
  extends SchemaCore<U[number]> {
  readonly enum: { [K in U[number]]: K };
  readonly options: U;
}

export type EnumSchemaCoreBuilder = <
  const U extends readonly [string, ...string[]],
>(
  values: U,
  options?: EnumValidationOptions
) => EnumSchemaCore<U>;

export const enumType: EnumSchemaCoreBuilder = <
  const U extends readonly [string, ...string[]],
>(
  values: U,
  options?: EnumValidationOptions
) => {
  const baseParse = createEnumTypeParse(values, options);
  const schema = createSchema('enum', baseParse, {
    abortEarly: options?.abortEarly,
  }) as SchemaCore<U[number]> & { enum?: { [K in U[number]]: K }; options?: U };

  schema.enum = values.reduce(
    (acc, value) => {
      acc[value as U[number]] = value;

      return acc;
    },
    {} as { [K in U[number]]: K }
  );

  schema.options = values;

  return schema as EnumSchemaCore<U>;
};
