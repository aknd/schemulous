import type { Parse, SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';
import { ValidationError, createValidationIssue } from './errors';

export const createSymbolParse =
  (options?: ValidationOptions): Parse<symbol> =>
  (value, params) => {
    if (value === undefined) {
      const issue = createValidationIssue({
        schemaType: 'symbol',
        code: 'required',
        value,
        message: options?.required_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }
    if (typeof value !== 'symbol') {
      const issue = createValidationIssue({
        schemaType: 'symbol',
        code: 'invalid_type',
        value,
        message: options?.invalid_type_error,
        path: params?.path,
      });
      throw new ValidationError([issue]);
    }

    return value;
  };

export const symbol: SchemaCoreBuilder<symbol, ValidationOptions> = (
  options
) => {
  const baseParse = createSymbolParse(options);
  const schema = createSchema('symbol', baseParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
