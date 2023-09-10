import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export const createNumberParse =
  (options?: ValidationOptions): Parse<number> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'number',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (typeof value !== 'number' || Number.isNaN(value)) {
      const issue = createValidationIssue({
        schemaType: 'number',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const number: SchemaCoreBuilder<number, ValidationOptions> = (
  options
) => {
  const baseParse = createNumberParse(options);
  const schema = createSchema('number', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
