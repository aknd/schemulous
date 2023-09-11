import { describe, expect, test } from 'vitest';
import { number, object, string, union } from '../src';

describe('UnionSchema', () => {
  describe('basic validation', () => {
    const StringOrNumberSchema = union([string(), number().int()]);

    test('should validate string successfully', () => {
      const result = StringOrNumberSchema.safeParse('John');
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('John');
    });

    test('should validate integer successfully', () => {
      const result = StringOrNumberSchema.safeParse(30);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe(30);
    });

    test('should fail validation for non-integer number', () => {
      const result = StringOrNumberSchema.safeParse(30.5);
      expect(result.success).toBe(false);
    });
  });

  describe('complex union', () => {
    const NameSchema = object({
      name: string(),
    });

    const AgeSchema = object({
      age: number().int(),
    });

    const UserSchema = union([NameSchema, AgeSchema]);

    test('should validate name object successfully', () => {
      const result = UserSchema.safeParse({
        name: 'John',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
      });
    });

    test('should validate age object successfully', () => {
      const result = UserSchema.safeParse({
        age: 30,
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        age: 30,
      });
    });

    test('should validate with the first matching schema', () => {
      const result = UserSchema.safeParse({
        name: 'John',
        age: 30,
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
      });
    });

    test('should validate with the second matching schema', () => {
      const result = UserSchema.safeParse({
        age: 30,
        address: '123 Main St',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        age: 30,
      });
    });
  });
});
