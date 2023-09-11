import { describe, expect, test } from 'vitest';
import { string } from '../src';

describe('StringSchema', () => {
  describe('minLength', () => {
    test('should validate successfully', () => {
      const result = string().minLength(5).safeParse('abcdef');
      expect(result.success).toBe(true);
    });

    test('should fail validation', () => {
      const result = string().minLength(5).safeParse('abc');
      expect(result.success).toBe(false);
    });
  });

  describe('maxLength', () => {
    test('should validate successfully', () => {
      const result = string().maxLength(5).safeParse('abc');
      expect(result.success).toBe(true);
    });

    test('should fail validation', () => {
      const result = string().maxLength(5).safeParse('abcdefg');
      expect(result.success).toBe(false);
    });
  });

  describe('email', () => {
    test('should validate email successfully', () => {
      const result = string().email().safeParse('test@example.com');
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('test@example.com');
    });

    test('should fail email validation', () => {
      const result = string().email().safeParse('invalid-email');
      expect(result.success).toBe(false);
    });
  });

  describe('uuid', () => {
    test('should validate uuid successfully', () => {
      const result = string()
        .uuid()
        .safeParse('f47ac10b-58cc-4372-a567-0e02b2c3d479');
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479');
    });

    test('should fail uuid validation', () => {
      const result = string().uuid().safeParse('invalid-uuid');
      expect(result.success).toBe(false);
    });
  });

  describe('date', () => {
    test('should validate successfully', () => {
      const result = string().date().safeParse('2023-09-11');
      expect(result.success).toBe(true);
    });

    test('should fail validation', () => {
      const result = string().date().safeParse('invalid-date');
      expect(result.success).toBe(false);
    });
  });

  describe('dateTime', () => {
    test('should validate successfully', () => {
      const result = string().dateTime().safeParse('2023-09-11T12:34:56+09:00');
      expect(result.success).toBe(true);
    });

    test('should fail validation', () => {
      const result = string().dateTime().safeParse('invalid-datetime');
      expect(result.success).toBe(false);
    });
  });

  describe('numeric', () => {
    test('should validate successfully', () => {
      const result = string().numeric().safeParse('12345');
      expect(result.success).toBe(true);
    });

    test('should fail validation', () => {
      const result = string().numeric().safeParse('abcde');
      expect(result.success).toBe(false);
    });
  });

  describe('optional', () => {
    test('should validate successfully', () => {
      const result = string().optional().safeParse('abcdef');
      expect(result.success).toBe(true);
    });

    test('should validate undefined successfully', () => {
      const result = string().optional().safeParse(undefined);
      expect(result.success).toBe(true);
    });
  });

  describe('nullable', () => {
    test('should validate successfully', () => {
      const result = string().nullable().safeParse('abcdef');
      expect(result.success).toBe(true);
    });

    test('should validate null successfully', () => {
      const result = string().nullable().safeParse(null);
      expect(result.success).toBe(true);
    });
  });

  describe('nullish', () => {
    test('should validate successfully', () => {
      const result = string().nullish().safeParse('abcdef');
      expect(result.success).toBe(true);
    });

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
