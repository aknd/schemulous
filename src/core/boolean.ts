import { ValidationError, createValidationIssue } from './errors';
import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';

export const createBooleanParse =
  (options?: ValidationOptions): Parse<boolean> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'boolean',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (typeof value !== 'boolean') {
      const issue = createValidationIssue({
        schemaType: 'boolean',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const boolean: SchemaCoreBuilder<boolean, ValidationOptions> = (
  options
) => {
  const baseParse = createBooleanParse(options);
  const schema = createSchema('boolean', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
