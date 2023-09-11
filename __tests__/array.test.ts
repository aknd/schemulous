import { describe, expect, test } from 'vitest';
import { array, string } from '../src';

describe('ArraySchema', () => {
  describe('basic validation', () => {
    const StringArray = array(string());

    test('should validate array of strings successfully', () => {
      const result = StringArray.safeParse(['a', 'b', 'c']);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(['a', 'b', 'c']);
      }
    });

    test('should fail validation for non-array value', () => {
      const result = StringArray.safeParse('not an array');
      expect(result.success).toBe(false);
    });

    test('should fail validation for array with non-string element', () => {
      const result = StringArray.safeParse(['a', 123, 'c']);
      expect(result.success).toBe(false);
    });
  });

  describe('minItems', () => {
    const MinItemsArray = array(string()).minItems(2);

    test('should validate array with enough items', () => {
      const result = MinItemsArray.safeParse(['a', 'b']);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(['a', 'b']);
      }
    });

    test('should fail validation for array with insufficient items', () => {
      const result = MinItemsArray.safeParse(['a']);
      expect(result.success).toBe(false);
    });
  });

  describe('maxItems', () => {
    const MaxItemsArray = array(string()).maxItems(2);

    test('should validate array within item limit', () => {
      const result = MaxItemsArray.safeParse(['a', 'b']);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(['a', 'b']);
      }
    });

    test('should fail validation for array exceeding item limit', () => {
      const result = MaxItemsArray.safeParse(['a', 'b', 'c']);
      expect(result.success).toBe(false);
    });
  });
});
