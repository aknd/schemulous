export type { SchemaMetadata, WithOpenApiMetadata } from './openapi-extensions';
export { meta } from './openapi-extensions';

export type {
  Fallback,
  RefineParams,
  WithOptional,
  WithPrivateProps,
} from './schema-extensions';
export {
  catchValue,
  copy,
  defaultValue,
  nullable,
  nullish,
  optional,
  postprocess,
  preprocess,
  refine,
} from './schema-extensions';

export {
  date,
  dateTime,
  email,
  maxLength,
  minLength,
  numeric,
  pattern,
  uuid,
} from './string-extensions';

export type {
  WithExclusiveMaximum,
  WithExclusiveMinimum,
} from './number-extensions';
export {
  exclusiveMaximum,
  exclusiveMinimum,
  int,
  maximum,
  minimum,
  multipleOf,
} from './number-extensions';

export type { WithObjectSchemaEx } from './object-extensions';
export { passthrough, strict } from './object-extensions';

export { maxItems, minItems } from './array-extensions';

export { maxProperties, minProperties } from './record-extensions';
