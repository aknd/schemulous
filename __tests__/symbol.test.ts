import { describe, expect, test } from 'vitest';
import { symbol } from '../src';

describe('SymbolSchema', () => {
  describe('basic validation', () => {
    test('should validate symbol successfully', () => {
      const sym = Symbol('test');
      const result = symbol().safeParse(sym);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(sym);
      }
    });

    test('should fail validation for non-symbol value (string)', () => {
      const result = symbol().safeParse('test');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-symbol value (number)', () => {
      const result = symbol().safeParse(123);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-symbol value (boolean)', () => {
      const result = symbol().safeParse(true);
      expect(result.success).toBe(false);
    });
  });
});
