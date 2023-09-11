import { describe, expect, test } from 'vitest';
import {
  array,
  boolean,
  intersection,
  number,
  object,
  string,
  tuple,
  union,
} from '../src';

describe('Nested Combined Schema Tests', () => {
  const StringSchema = string().minLength(5).maxLength(10).email();

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
      id: NumberSchema.copy(),
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
      usersArray: {
        users: ['JohnDoe@example.com', 'JaneDoe@example.com'],
      },
    };

    const result = ComplexObjectSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual(data);
  });
});
