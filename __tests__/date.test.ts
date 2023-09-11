import { describe, expect, test } from 'vitest';
import { date } from '../src';

describe('DateSchema', () => {
  describe('basic validation', () => {
    test('should validate date successfully', () => {
      const value = new Date();
      const result = date().safeParse(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(value);
      }
    });

    test('should fail validation for non-date value (string)', () => {
      const result = date().safeParse('test');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-date value (number)', () => {
      const result = date().safeParse(123);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-date value (boolean)', () => {
      const result = date().safeParse(true);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-date value (object)', () => {
      const result = date().safeParse({ key: 'value' });
      expect(result.success).toBe(false);
    });
  });
});
