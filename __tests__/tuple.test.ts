import { describe, expect, test } from 'vitest';
import { boolean, number, string, tuple } from '../src';

describe('TupleSchema', () => {
  describe('basic validation', () => {
    const StringNumberTuple = tuple([string(), number()]);

    test('should validate tuple of string and number successfully', () => {
      const result = StringNumberTuple.safeParse(['hello', 123]);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual(['hello', 123]);
    });

    test('should fail validation for incorrect types', () => {
      const result = StringNumberTuple.safeParse(['hello', '123']); // Second element should be a number
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual([1]);
    });

    test('should fail validation for incorrect tuple length', () => {
      const result = StringNumberTuple.safeParse(['hello']);
      expect(result.success).toBe(false);
    });
  });

  describe('mixed type tuple', () => {
    const MixedTuple = tuple([string(), number(), boolean()]);

    test('should validate tuple of string, number, and boolean successfully', () => {
      const result = MixedTuple.safeParse(['hello', 123, true]);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual(['hello', 123, true]);
    });

    test('should fail validation for incorrect types in mixed tuple', () => {
      const result = MixedTuple.safeParse(['hello', '123', true]); // Second element should be a number
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual([1]);
    });

    test('should fail validation for incorrect tuple length in mixed tuple', () => {
      const result = MixedTuple.safeParse(['hello', 123]);
      expect(result.success).toBe(false);
    });
  });
});
