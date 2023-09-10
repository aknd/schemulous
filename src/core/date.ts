import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export const createDateParse =
  (options?: ValidationOptions): Parse<Date> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'date',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (!(value instanceof Date)) {
      const issue = createValidationIssue({
        schemaType: 'date',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const date: SchemaCoreBuilder<Date, ValidationOptions> = (options) => {
  const baseParse = createDateParse(options);
  const schema = createSchema('date', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
