import { describe, expect, test } from 'vitest';
import { undefinedType } from '../src';

describe('UndefinedTypeSchema', () => {
  describe('basic validation', () => {
    test('should validate undefined successfully', () => {
      const result = undefinedType().safeParse(undefined);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeUndefined();
    });

    test('should fail validation for non-undefined value (string)', () => {
      const result = undefinedType().safeParse('not undefined');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-undefined value (number)', () => {
      const result = undefinedType().safeParse(123);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-undefined value (boolean)', () => {
      const result = undefinedType().safeParse(true);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-undefined value (object)', () => {
      const result = undefinedType().safeParse({ key: 'value' });
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-undefined value (null)', () => {
      const result = undefinedType().safeParse(null);
      expect(result.success).toBe(false);
    });
  });
});
