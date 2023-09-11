import { describe, expect, test } from 'vitest';
import { enumType } from '../src';

describe('EnumTypeSchema', () => {
  describe('basic validation', () => {
    const ColorEnum = enumType(['Red', 'Green', 'Blue'] as const);

    test('should validate enum value successfully', () => {
      const result = ColorEnum.safeParse('Red');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Red');
      }
    });

    test('should fail validation for non-enum value (string)', () => {
      const result = ColorEnum.safeParse('Yellow');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-enum value (number)', () => {
      const result = ColorEnum.safeParse(123);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-enum value (boolean)', () => {
      const result = ColorEnum.safeParse(true);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-enum value (object)', () => {
      const result = ColorEnum.safeParse({ key: 'value' });
      expect(result.success).toBe(false);
    });
  });
});
