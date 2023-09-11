import { describe, expect, test } from 'vitest';
import {
  any,
  array,
  boolean,
  date,
  enumType,
  intersection,
  literal,
  nullType,
  number,
  object,
  record,
  string,
  symbol,
  tuple,
  undefinedType,
  union,
} from '../../src/core';
import {
  copy,
  email,
  exclusiveMaximum,
  exclusiveMinimum,
  int,
  maxLength,
  maximum,
  minLength,
  minimum,
  safeParse,
} from '../../src/extensions';

describe('Nested Combined SchemaCore Tests', () => {
  const StringSchema = email(maxLength(minLength(string(), 5), 10));

  const NumberSchema = maximum(minimum(int(number()), 5), 100);

  const NumberSchemaExclusive = exclusiveMaximum(
    maximum(exclusiveMinimum(minimum(number(), 10)), 90)
  );

  const SimpleObjectSchema = object({
    name: copy(StringSchema),
    age: copy(NumberSchema),
    score: copy(NumberSchemaExclusive),
  });

  const NestedObjectSchema = object({
    profile: copy(SimpleObjectSchema),
    isActive: boolean(),
  });

  const ArrayWithObjectSchema = array(
    object({
      id: copy(NumberSchema),
      details: copy(SimpleObjectSchema),
    })
  );

  const TupleSchema = tuple([
    copy(StringSchema),
    copy(NumberSchema),
    boolean(),
  ]);

  const NestedTupleSchema = tuple([copy(StringSchema), copy(TupleSchema)]);

  const IntersectionSchema = intersection([
    copy(SimpleObjectSchema),
    object({ isVerified: boolean() }),
  ]);

  const UnionSchema = union([copy(StringSchema), copy(SimpleObjectSchema)]);

  const ComplexObjectSchema = object({
    data: NestedObjectSchema,
    list: ArrayWithObjectSchema,
    mixed: NestedTupleSchema,
    both: IntersectionSchema,
    either: UnionSchema,
  });

  test('should validate lightweight nested combined schemas successfully', () => {
    const data = {
      data: {
        profile: {
          name: 'JohnDoe@example.com',
          age: 30,
          score: 50,
        },
        isActive: true,
      },
      list: [
        {
          id: 1,
          details: {
            name: 'JohnDoe@example.com',
            age: 25,
            score: 45,
          },
        },
        {
          id: 2,
          details: {
            name: 'JaneDoe@example.com',
            age: 28,
            score: 55,
          },
        },
      ],
      mixed: ['Hello', ['World', 42, false]],
      both: {
        name: 'JohnDoe@example.com',
        age: 30,
        score: 60,
        isVerified: true,
      },
      either: {
        name: 'JohnDoe@example.com',
        age: 30,
        score: 65,
      },
    };

    const result = safeParse(ComplexObjectSchema, data);
    if (!result.success) {
      console.log(result.error.issues);
    }
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(data);
  });
});

describe('Additional Combined SchemaCore Tests', () => {
  const ExtendedObjectSchema = object({
    sym: symbol(),
    undef: undefinedType(),
    nul: nullType(),
    dt: date(),
    anyField: any(),
    lit: literal('specificValue'),
    enumField: enumType(['option1', 'option2', 'option3']),
    rec: record(number()),
  });

  test('should validate extended combined schemas successfully', () => {
    const data = {
      sym: Symbol('test'),
      undef: undefined,
      nul: null,
      dt: new Date(),
      anyField: 'anything',
      lit: 'specificValue',
      enumField: 'option2',
      rec: { key1: 1, key2: 2 },
    };

    const result = safeParse(ExtendedObjectSchema, data);
    if (!result.success) {
      console.log(result.error.issues);
    }
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(data);
  });
});
