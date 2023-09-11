import { describe, expect, test } from 'vitest';
import { boolean } from '../src';

describe('BooleanSchema', () => {
  describe('basic validation', () => {
    test('should validate true successfully', () => {
      const result = boolean().safeParse(true);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(true);
      }
    });

    test('should validate false successfully', () => {
      const result = boolean().safeParse(false);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(false);
      }
    });

    test('should fail validation for non-boolean value (string)', () => {
      const result = boolean().safeParse('true');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-boolean value (number)', () => {
      const result = boolean().safeParse(1);
      expect(result.success).toBe(false);
    });
  });
});
