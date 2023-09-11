import { describe, expect, test } from 'vitest';
import { array, number, object, string } from '../src';

describe('ObjectSchema', () => {
  describe('basic validation', () => {
    const UserSchema = object({
      name: string(),
      age: number().int(),
      hobbies: array(string()),
    });

    test('should validate object successfully', () => {
      const result = UserSchema.safeParse({
        name: 'John',
        age: 30,
        hobbies: ['reading', 'swimming'],
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
        age: 30,
        hobbies: ['reading', 'swimming'],
      });
    });

    test('should remove undefined keys', () => {
      const result = UserSchema.safeParse({
        name: 'John',
        age: 30,
        hobbies: ['reading', 'swimming'],
        extraKey: 'extraValue',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
        age: 30,
        hobbies: ['reading', 'swimming'],
      });
    });

    test('should fail validation for incorrect types', () => {
      const result = UserSchema.safeParse({
        name: 'John',
        age: '30', // This should be a number
        hobbies: ['reading', 'swimming'],
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual(['age']);
    });
  });

  describe('passthrough', () => {
    const UserSchemaPassthrough = object({
      name: string(),
      age: number().int(),
    }).passthrough();

    test('should retain undefined keys', () => {
      const result = UserSchemaPassthrough.safeParse({
        name: 'John',
        age: 30,
        extraKey: 'extraValue',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        name: 'John',
        age: 30,
        extraKey: 'extraValue',
      });
    });
  });

  describe('strict', () => {
    const UserSchemaStrict = object({
      name: string(),
      age: number().int(),
      address: object({
        street: string(),
        details: object({
          floor: number().int(),
          checkPoint: array(number().int()),
        }).strict(), // This should be strict
      }),
    });

    test('should fail validation for undefined keys', () => {
      const result = UserSchemaStrict.safeParse({
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          details: {
            floor: 2,
            checkPoint: [1, 2, 3],
            extraKey: 'extraValue',
          },
        },
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual(['address', 'details']);
      expect(result.error.issues[0].keys).toEqual(['extraKey']);
    });
  });

  describe('nested object with array', () => {
    const AddressSchema = object({
      street: string(),
      details: object({
        floor: number().int(),
        checkPoint: array(number().int()),
      }),
    });

    test('should validate nested object successfully', () => {
      const result = AddressSchema.safeParse({
        street: '123 Main St',
        details: {
          floor: 2,
          checkPoint: [1, 2, 3],
        },
      });
      expect(result.success).toBe(true);
    });

    test('should fail validation for incorrect types in nested object', () => {
      const result = AddressSchema.safeParse({
        street: '123 Main St',
        details: {
          floor: 2,
          checkPoint: [1, '2', 3], // The second item should be a number
        },
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual(['details', 'checkPoint', 1]);
    });
  });
});
