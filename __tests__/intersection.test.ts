import { describe, expect, test } from 'vitest';
import { intersection, number, object, string } from '../src';

describe('IntersectionSchema', () => {
  const NameSchema = object({
    name: string(),
  });

  const AgeSchema = object({
    age: number().int(),
  });

  describe('basic validation', () => {
    const UserSchema = intersection([NameSchema, AgeSchema]);

    test('should validate intersection of name and age successfully', () => {
      const result = UserSchema.safeParse({
        name: 'John',
        age: 30,
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
        age: 30,
      });
    });

    test('should fail validation for missing properties', () => {
      const result = UserSchema.safeParse({
        name: 'John',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('multiple intersection', () => {
    const AddressSchema = object({
      address: string(),
    });

    const DetailedUserSchema = intersection([
      NameSchema,
      AgeSchema,
      AddressSchema,
    ]);

    test('should validate intersection of name, age, and address successfully', () => {
      const result = DetailedUserSchema.safeParse({
        name: 'John',
        age: 30,
        address: '123 Main St',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
        age: 30,
        address: '123 Main St',
      });
    });

    test('should fail validation for missing properties in multiple intersection', () => {
      const result = DetailedUserSchema.safeParse({
        name: 'John',
        age: 30,
      });
      expect(result.success).toBe(false);
    });
  });
});
