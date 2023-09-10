import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export const createNullTypeParse =
  (options?: ValidationOptions): Parse<null> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'null',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (value !== null) {
      const issue = createValidationIssue({
        schemaType: 'null',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const nullType: SchemaCoreBuilder<null, ValidationOptions> = (
  options
) => {
  const baseParse = createNullTypeParse(options);
  const schema = createSchema('null', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
