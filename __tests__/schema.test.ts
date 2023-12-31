import { describe, expect, test } from 'vitest';
import {
  ValidationError,
  createSchema,
  createValidationIssue,
  number,
  object,
  string,
} from '../src';

describe('Schema', () => {
  // String
  describe('string', () => {
    describe('non optional', () => {
      test('should fail undefined validation', () => {
        const result = string().safeParse(undefined);
        expect(result.success).toBe(false);
      });
    });

    describe('optional', () => {
      test('should validate undefined successfully', () => {
        const result = string().optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('non nullable', () => {
      test('should fail null validation', () => {
        const result = string().safeParse(null);
        expect(result.success).toBe(false);
      });
    });

    describe('nullable', () => {
      test('should validate null successfully', () => {
        const result = string().nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('non nullish', () => {
      test('should fail null validation', () => {
        const result = string().safeParse(null);
        expect(result.success).toBe(false);
      });

      test('should fail undefined validation', () => {
        const result = string().safeParse(undefined);
        expect(result.success).toBe(false);
      });
    });

    describe('nullish', () => {
      test('should validate null successfully', () => {
        const result = string().nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = string().nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const result = string().default('default-value').safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe('default-value');
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackValue = 'fallback';
        const result = string()
          .minLength(8)
          .catch(() => fallbackValue)
          .safeParse('abc');
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(fallbackValue);
      });
    });
  });

  // Number
  describe('number', () => {
    describe('non optional', () => {
      test('should fail undefined validation', () => {
        const result = number().safeParse(undefined);
        expect(result.success).toBe(false);
      });
    });

    describe('optional', () => {
      test('should validate undefined successfully', () => {
        const result = number().optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('non nullable', () => {
      test('should fail null validation', () => {
        const result = number().safeParse(null);
        expect(result.success).toBe(false);
      });
    });

    describe('nullable', () => {
      test('should validate null successfully', () => {
        const result = number().nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('non nullish', () => {
      test('should fail null validation', () => {
        const result = number().safeParse(null);
        expect(result.success).toBe(false);
      });

      test('should fail undefined validation', () => {
        const result = number().safeParse(undefined);
        expect(result.success).toBe(false);
      });
    });

    describe('nullish', () => {
      test('should validate null successfully', () => {
        const result = number().nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = number().nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const result = number().default(100).safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(100);
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackValue = 100;
        const result = number()
          .minimum(10)
          .catch(() => fallbackValue)
          .safeParse(5);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(fallbackValue);
      });
    });
  });

  // CustomSchema
  describe('CustomSchema', () => {
    const CustomSchema = createSchema('custom', (value: unknown) => {
      if (typeof value !== 'string' || !value.startsWith('custom-')) {
        const issue = createValidationIssue({
          schemaType: 'string',
          code: 'custom',
          value,
        });
        throw new ValidationError([issue]);
      }

      return value;
    });

    test('should validate custom value successfully', () => {
      const result = CustomSchema.safeParse('custom-value');
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('custom-value');
    });

    test('should fail validation for invalid custom value', () => {
      const result = CustomSchema.safeParse('invalid-value');
      expect(result.success).toBe(false);
    });
  });

  describe('Schema Copy', () => {
    describe('StringSchema', () => {
      const originalSchema = string().minLength(5);
      const copiedSchema = originalSchema.copy().maxLength(10);

      test('original schema should not have maxLength constraint', () => {
        const result = originalSchema.safeParse('abcdefghijk');
        expect(result.success).toBe(true);
      });

      test('copied schema should have minLength constraint', () => {
        const result = copiedSchema.safeParse('abcd');
        expect(result.success).toBe(false);
      });

      test('copied schema should have maxLength constraint', () => {
        const result = copiedSchema.safeParse('abcdefghijk');
        expect(result.success).toBe(false);
      });
    });

    describe('NumberSchema', () => {
      const originalSchema = number().minimum(5);
      const copiedSchema = originalSchema.copy().maximum(10);

      test('original schema should not have maximum constraint', () => {
        const result = originalSchema.safeParse(15);
        expect(result.success).toBe(true);
      });

      test('copied schema should have minimum constraint', () => {
        const result = copiedSchema.safeParse(4);
        expect(result.success).toBe(false);
      });

      test('copied schema should have maximum constraint', () => {
        const result = copiedSchema.safeParse(15);
        expect(result.success).toBe(false);
      });
    });

    describe('ObjectSchema', () => {
      const originalSchema = object({
        name: string().minLength(4),
      });
      const copiedSchema = originalSchema.copy().passthrough();

      test('original schema should not allow additional properties', () => {
        const result = originalSchema.safeParse({ name: 'John', age: 30 });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toEqual({ name: 'John' });
      });

      test('name of copied schema with passthrough should have minLength constraint', () => {
        const result = copiedSchema.safeParse({ name: 'Jo', age: 30 });
        expect(result.success).toBe(false);
        if (result.success) return;
        const issue = result.error.issues.find((i) => i.path?.[0] === 'name');
        expect(issue?.code).toEqual('too_small');
      });

      test('copied schema with passthrough should allow additional properties', () => {
        const result = copiedSchema.safeParse({ name: 'John', age: 30 });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toEqual({ name: 'John', age: 30 });
      });
    });
  });
});
