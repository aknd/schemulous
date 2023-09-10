/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SchemaCoreBuilder, ValidationOptions } from './schema';
import { createSchema } from './schema';

export const anyParse = (value: unknown): any => value;

export const any: SchemaCoreBuilder<
  any,
  Pick<ValidationOptions, 'abortEarly'>
> = (options) => {
  const schema = createSchema('any', anyParse, {
    abortEarly: options?.abortEarly,
  });

  return schema;
};
