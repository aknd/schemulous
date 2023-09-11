import type { SchemaCore } from '../core';
import { number as numberCore } from '../core';
import { exclusive, int, maximum, minimum, multipleOf } from '../extensions';
import type { OpenApiSchema } from './schema';

export const number = (
  openApiSchema: OpenApiSchema<number>
): SchemaCore<number> => {
  const schema = numberCore();

  if (openApiSchema.type === 'integer') {
    int(schema);
  }
  if (openApiSchema.minimum !== undefined) {
    minimum(schema, openApiSchema.minimum);
    if (openApiSchema.exclusiveMinimum) {
      exclusive(schema);
    }
  }
  if (openApiSchema.maximum !== undefined) {
    maximum(schema, openApiSchema.maximum);
    if (openApiSchema.exclusiveMaximum) {
      exclusive(schema);
    }
  }
  if (openApiSchema.multipleOf !== undefined) {
    multipleOf(schema, openApiSchema.multipleOf);
  }

  return schema;
};
