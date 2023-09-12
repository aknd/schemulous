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
} from '../src';

describe('Nested Combined Schema Tests', () => {
  const StringSchema = string().minLength(10).maxLength(20).email();

  const NumberSchema = number().int().minimum(5).maximum(100);

  const NumberSchemaExclusive = number()
    .int()
    .minimum(10)
    .exclusiveMinimum()
    .maximum(90)
    .exclusiveMaximum();

  const SimpleObjectSchema = object({
    name: StringSchema.copy(),
    age: NumberSchema.copy(),
    score: NumberSchemaExclusive.copy(),
  });

  const NestedObjectSchema = object({
    profile: SimpleObjectSchema.copy(),
    isActive: boolean(),
  }).strict();

  const ArrayWithObjectSchema = array(
    object({
      id: number().int(),
      details: SimpleObjectSchema.copy(),
    })
  );

  const ObjectWithArraySchema = object({
    users: array(StringSchema.copy()),
  }).passthrough();

  const TupleSchema = tuple([
    StringSchema.copy(),
    NumberSchema.copy(),
    boolean(),
  ]);

  const NestedTupleSchema = tuple([StringSchema.copy(), TupleSchema.copy()]);

  const IntersectionSchema = intersection([
    SimpleObjectSchema.copy(),
    object({ isVerified: boolean() }),
  ]);

  const UnionSchema = union([StringSchema.copy(), SimpleObjectSchema.copy()]);

  const ComplexObjectSchema = object({
    data: NestedObjectSchema.copy(),
    list: ArrayWithObjectSchema.copy(),
    mixed: NestedTupleSchema.copy(),
    both: IntersectionSchema.copy(),
    either: UnionSchema.copy(),
    usersArray: ObjectWithArraySchema.copy(),
  });

  test('should validate nested combined schemas successfully', () => {
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
      mixed: ['JohnDoe@example.com', ['JohnDoe@example.com', 42, false]],
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
      usersArray: {
        users: ['JohnDoe@example.com', 'JaneDoe@example.com'],
      },
    };

    const result = ComplexObjectSchema.safeParse(data);
    if (!result.success) {
      console.log(result.error.issues);
    }
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(data);
  });

  test('should fail validation for incorrect types in nested combined object', () => {
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
            age: 25.5, // Should be an integer
            score: 45,
          },
        },
        {
          id: 2,
          details: {
            name: 'JaneDoe@example.com',
            age: 28,
            score: 10, // Should be greater than 10
          },
        },
      ],
      mixed: [
        'JohnDoe@example.com',
        [
          'JohnDoe..@example.com', // Should be a valid email shorter or equal to 20 characters
          42,
          false,
        ],
      ],
      both: {
        name: 'JohnDoe@example.com',
        age: 30,
        score: 60,
        isVerified: true,
      },
      either: 'JohnDoe@example.com', // email instead of object (OK for union)
      usersArray: {
        users: ['JohnDoe@example.com', 'JaneDoe@example.com'],
      },
    };

    const result = ComplexObjectSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = result.error.issues;
    expect(issues.length).toEqual(4);
    let issue = issues.find(
      (i) =>
        i.path?.[0] === 'list' &&
        i.path?.[1] === 0 &&
        i.path?.[2] === 'details' &&
        i.path?.[3] === 'age'
    );
    expect(issue?.code).toEqual('invalid_type');
    issue = issues.find(
      (i) =>
        i.path?.[0] === 'list' &&
        i.path?.[1] === 1 &&
        i.path?.[2] === 'details' &&
        i.path?.[3] === 'score'
    );
    expect(issue?.code).toEqual('too_small');
    issue = issues.find(
      (i) =>
        i.path?.[0] === 'mixed' &&
        i.path?.[1] === 1 &&
        i.path?.[2] === 0 &&
        i.validation === 'email'
    );
    expect(issue?.code).toEqual('invalid_string');
    issue = issues.find(
      (i) =>
        i.path?.[0] === 'mixed' &&
        i.path?.[1] === 1 &&
        i.path?.[2] === 0 &&
        i.maximum === 20
    );
    expect(issue?.code).toEqual('too_big');
  });
});

describe('Additional Combined Schema Tests', () => {
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

  test('should validate chained combined schemas successfully', () => {
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

    const result = ExtendedObjectSchema.safeParse(data);
    if (!result.success) {
      console.log(result.error.issues);
    }
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(data);
  });
});
