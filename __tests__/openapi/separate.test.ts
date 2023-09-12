import { describe, expect, test } from 'vitest';
import {
  array,
  boolean,
  enumType,
  intersection,
  literal,
  nullType,
  number,
  object,
  record,
  string,
  toOpenApi,
  tuple,
  union,
} from '../../src';

describe('toOpenApi Tests', () => {
  test('should convert basic schemas to OpenAPI format', () => {
    // Convert to OpenAPI format
    const StringOpenApi = toOpenApi(
      string().meta({
        title: 'A string',
        description: 'A simple string',
        example: 'example',
        format: 'email',
        readOnly: true,
        writeOnly: false,
      })
    );
    const NumberOpenApi = toOpenApi(
      number().int().meta({
        title: 'A number',
        description: 'A simple number',
        example: 123,
        format: 'int32',
        readOnly: false,
        writeOnly: true,
      })
    );
    const ObjectOpenApi = toOpenApi(
      object({
        name: string(),
        age: number(),
      }).meta({
        title: 'An object',
        description: 'An object with name and age',
        example: { name: 'John', age: 30 },
      })
    );
    const ArrayOpenApi = toOpenApi(
      array(string()).meta({
        title: 'An array',
        description: 'An array of strings',
        example: ['a', 'b', 'c'],
      })
    );
    const TupleOpenApi = toOpenApi(
      tuple([string(), number()]).meta({
        title: 'A tuple',
        description: 'A tuple of string and number',
        example: ['hello', 123],
      })
    );
    const UnionOpenApi = toOpenApi(
      union([string(), number()]).meta({
        title: 'A union',
        description: 'A union of string and number',
        example: 'hello',
      })
    );
    const IntersectionOpenApi = toOpenApi(
      intersection([
        object({ id: number().int() }),
        object({ name: string(), tel: string().optional() }),
      ]).meta({
        title: 'An intersection',
        description: 'An intersection of string and object',
        example: { id: 1, name: 'John', tel: '080-0000-0000' },
      })
    );
    const LiteralOpenApi = toOpenApi(
      literal('hello').meta({
        title: 'A literal',
        description: 'A literal string',
        example: 'hello',
      })
    );
    const EnumOpenApi = toOpenApi(
      enumType(['a', 'b', 'c']).meta({
        title: 'An enum',
        description: 'An enum of strings',
        example: 'a',
      })
    );
    const RecordOpenApi = toOpenApi(
      record(string()).meta({
        title: 'A record',
        description: 'A record of strings',
        example: { key: 'value' },
      })
    );
    const NullOpenApi = toOpenApi(
      nullType().meta({
        title: 'A null',
        description: 'A null value',
        example: null,
      })
    );

    // Assertions
    expect(StringOpenApi).toEqual({
      type: 'string',
      title: 'A string',
      description: 'A simple string',
      example: 'example',
      format: 'email',
      readOnly: true,
      writeOnly: false,
    });
    expect(NumberOpenApi).toEqual({
      type: 'integer',
      title: 'A number',
      description: 'A simple number',
      example: 123,
      format: 'int32',
      readOnly: false,
      writeOnly: true,
    });
    expect(ObjectOpenApi).toEqual({
      type: 'object',
      title: 'An object',
      description: 'An object with name and age',
      example: { name: 'John', age: 30 },
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
    });
    expect(ArrayOpenApi).toEqual({
      type: 'array',
      title: 'An array',
      description: 'An array of strings',
      example: ['a', 'b', 'c'],
      items: { type: 'string' },
    });
    expect(TupleOpenApi).toEqual({
      type: 'array',
      title: 'A tuple',
      description: 'A tuple of string and number',
      example: ['hello', 123],
      items: [{ type: 'string' }, { type: 'number' }],
      minItems: 2,
      maxItems: 2,
    });
    expect(UnionOpenApi).toEqual({
      oneOf: [{ type: 'string' }, { type: 'number' }],
      title: 'A union',
      description: 'A union of string and number',
      example: 'hello',
    });
    expect(IntersectionOpenApi).toEqual({
      allOf: [
        {
          type: 'object',
          properties: { id: { type: 'integer' } },
          required: ['id'],
        },
        {
          type: 'object',
          properties: { name: { type: 'string' }, tel: { type: 'string' } },
          required: ['name'],
        },
      ],
      title: 'An intersection',
      description: 'An intersection of string and object',
      example: { id: 1, name: 'John', tel: '080-0000-0000' },
    });
    expect(LiteralOpenApi).toEqual({
      type: 'string',
      enum: ['hello'],
      title: 'A literal',
      description: 'A literal string',
      example: 'hello',
    });
    expect(EnumOpenApi).toEqual({
      type: 'string',
      enum: ['a', 'b', 'c'],
      title: 'An enum',
      description: 'An enum of strings',
      example: 'a',
    });
    expect(RecordOpenApi).toEqual({
      type: 'object',
      title: 'A record',
      description: 'A record of strings',
      example: { key: 'value' },
      additionalProperties: { type: 'string' },
    });
    expect(NullOpenApi).toEqual({
      enum: [null],
      title: 'A null',
      description: 'A null value',
      example: null,
    });
  });
});

describe('toOpenApi with nullable() Tests', () => {
  test('should convert nullable schemas to OpenAPI format', () => {
    // Convert to OpenAPI format with nullable
    const StringOpenApi = toOpenApi(string().nullable());
    const NumberOpenApi = toOpenApi(number().nullable());
    const BooleanOpenApi = toOpenApi(boolean().nullable());
    const ObjectOpenApi = toOpenApi(object({ name: string() }).nullable());
    const ArrayOpenApi = toOpenApi(array(string()).nullable());
    const LiteralOpenApi = toOpenApi(literal('hello').nullable());
    const EnumOpenApi = toOpenApi(enumType(['a', 'b', 'c']).nullable());
    const RecordOpenApi = toOpenApi(record(string()).nullable());
    const TupleOpenApi = toOpenApi(tuple([string(), number()]).nullable());
    const UnionOpenApi = toOpenApi(union([string(), number()]).nullable());
    const IntersectionOpenApi = toOpenApi(
      intersection([
        object({ id: number() }),
        object({ name: string() }),
      ]).nullable()
    );

    // Assertions
    expect(StringOpenApi).toEqual({
      type: 'string',
      nullable: true,
    });
    expect(NumberOpenApi).toEqual({
      type: 'number',
      nullable: true,
    });
    expect(BooleanOpenApi).toEqual({
      type: 'boolean',
      nullable: true,
    });
    expect(ObjectOpenApi).toEqual({
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      nullable: true,
    });
    expect(ArrayOpenApi).toEqual({
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    });
    expect(LiteralOpenApi).toEqual({
      type: 'string',
      enum: ['hello', null],
      nullable: true,
    });
    expect(EnumOpenApi).toEqual({
      type: 'string',
      enum: ['a', 'b', 'c', null],
      nullable: true,
    });
    expect(RecordOpenApi).toEqual({
      type: 'object',
      additionalProperties: { type: 'string' },
      nullable: true,
    });
    expect(TupleOpenApi).toEqual({
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }],
      minItems: 2,
      maxItems: 2,
      nullable: true,
    });
    expect(UnionOpenApi).toEqual({
      oneOf: [{ type: 'string' }, { type: 'number' }],
      nullable: true,
    });
    expect(IntersectionOpenApi).toEqual({
      allOf: [
        {
          type: 'object',
          properties: { id: { type: 'number' } },
          required: ['id'],
        },
        {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
        },
      ],
      nullable: true,
    });
  });
});
