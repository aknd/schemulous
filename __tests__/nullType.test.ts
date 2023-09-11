import { describe, expect, test } from 'vitest';
import { nullType } from '../src';

describe('NullTypeSchema', () => {
  describe('basic validation', () => {
    test('should validate null successfully', () => {
      const result = nullType().safeParse(null);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeNull();
    });

    test('should fail validation for non-null value (string)', () => {
      const result = nullType().safeParse('not null');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-null value (number)', () => {
      const result = nullType().safeParse(123);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-null value (boolean)', () => {
      const result = nullType().safeParse(true);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-null value (object)', () => {
      const result = nullType().safeParse({ key: 'value' });
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-null value (undefined)', () => {
      const result = nullType().safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });
});
