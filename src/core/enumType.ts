import type { SchemaCore, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export type EnumTypeValidationOptions = ValidationOptions & {
  invalid_enum_value_error?: string | ((value: string) => string);
};

export interface EnumTypeSchemaCore<U extends readonly [string, ...string[]]>
  extends SchemaCore<U[number]> {
  readonly enum: { readonly [K in U[number]]: K };
  options: readonly [...U];
}

export const createEnumTypeSchemaBase = <
  U extends readonly [string, ...string[]],
>(
  values: U,
  options?: EnumTypeValidationOptions
): Pick<EnumTypeSchemaCore<U>, 'baseParse' | 'enum' | 'options'> => {
  const schema = { options: values } as Partial<EnumTypeSchemaCore<U>> & {
    enum?: { [K in U[number]]: K };
  };

  schema.enum = values.reduce(
    (acc, value) => {
      acc[value as U[number]] = value;

      return acc;
    },
    {} as { [K in U[number]]: K }
  );

  schema.baseParse = (value, params): U[number] => {
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

  return schema as Pick<
    EnumTypeSchemaCore<U>,
    'baseParse' | 'enum' | 'options'
  >;
};

export type EnumTypeSchemaCoreBuilder = <
  U extends readonly [string, ...string[]],
>(
  values: U,
  options?: EnumTypeValidationOptions
) => EnumTypeSchemaCore<U>;

export const enumType: EnumTypeSchemaCoreBuilder = <
  U extends readonly [string, ...string[]],
>(
  values: U,
  options?: EnumTypeValidationOptions
) => {
  const baseSchema = createEnumTypeSchemaBase(values, options);
  const schema = createSchema('enum', baseSchema.baseParse, {
    abortEarly: options?.abortEarly,
  }) as SchemaCore<U[number]> & { enum?: { [K in U[number]]: K }; options?: U };
  Object.assign(schema, baseSchema);

  return schema as EnumTypeSchemaCore<U>;
};
