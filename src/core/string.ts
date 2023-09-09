import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema as createSchemaCore } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export const createStringParse =
  (options?: ValidationOptions): Parse<string> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'string',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (typeof value !== 'string') {
      const issue = createValidationIssue({
        schemaType: 'string',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const string: SchemaCoreBuilder<string, ValidationOptions> = (
  options
) => {
  const baseParse = createStringParse(options);
  const schema = createSchemaCore('string', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
