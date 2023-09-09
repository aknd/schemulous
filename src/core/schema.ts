export type SchemaType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'null'
  | 'date'
  | 'object'
  | 'array'
  | 'any'
  | 'literal'
  | 'enum'
  | 'record'
  | 'tuple'
  | 'intersection'
  | 'union'
  | 'custom'; // NOTE: To create a custom schema, set the schemaType to 'custom'.

export type ParseParams = {
  path?: (string | number)[];
};

export type Parse<T> = (value: unknown, params?: ParseParams) => T;

export type SchemaContext = {
  abortEarly?: boolean;
};

export interface SchemaCore<T> {
  schemaType: SchemaType;
  baseParse: Parse<T>;
  ctx?: SchemaContext;
}

export type Infer<S> = S extends SchemaCore<infer T> ? T : unknown;

export const createSchema = <T>(
  schemaType: SchemaType,
  baseParse: Parse<T>,
  ctx?: SchemaContext
): SchemaCore<T> => {
  const schema = {
    schemaType,
    baseParse,
    ctx,
  };

  return schema;
};

export type ValidationOptions = {
  required_error?: string;
  invalid_type_error?: string;
  abortEarly?: boolean;
};

export type SchemaCoreBuilder<T, Options extends { [key: string]: unknown }> = (
  options?: Options
) => SchemaCore<T>;
