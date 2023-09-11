import { describe, expect, test } from 'vitest';
import { any } from '../src';

describe('AnySchema', () => {
  describe('basic validation', () => {
    test('should validate any value (string)', () => {
      const value = 'test';
      const result = any().safeParse(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    test('should validate any value (number)', () => {
      const value = 123;
      const result = any().safeParse(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    test('should validate any value (boolean)', () => {
      const value = true;
      const result = any().safeParse(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    test('should validate any value (symbol)', () => {
      const value = Symbol('test');
      const result = any().safeParse(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    });

    test('should validate any value (object)', () => {
      const value = { key: 'value' };
      const result = any().safeParse(value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(value);
      }
    });
  });
});
