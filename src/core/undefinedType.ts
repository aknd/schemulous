import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export const createUndefinedTypeParse =
  (options?: ValidationOptions): Parse<undefined> =>
  (value, params) => {
    if (value !== undefined) {
      const issue = createValidationIssue({
        schemaType: 'undefined',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const undefinedType: SchemaCoreBuilder<
  undefined,
  Omit<ValidationOptions, 'required_error'>
> = (options) => {
  const baseParse = createUndefinedTypeParse(options);
  const schema = createSchema('undefined', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
