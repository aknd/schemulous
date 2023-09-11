import { describe, expect, test } from 'vitest';
import { literal } from '../src';

describe('LiteralSchema', () => {
  describe('basic validation', () => {
    const RedLiteral = literal('Red');

    test('should validate literal value successfully', () => {
      const result = RedLiteral.safeParse('Red');
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBe('Red');
    });

    test('should fail validation for non-literal value (string)', () => {
      const result = RedLiteral.safeParse('Green');
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-literal value (number)', () => {
      const result = RedLiteral.safeParse(123);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-literal value (boolean)', () => {
      const result = RedLiteral.safeParse(true);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-literal value (object)', () => {
      const result = RedLiteral.safeParse({ color: 'Red' });
      expect(result.success).toBe(false);
    });
  });

  describe('Literal Undefined', () => {
    const UndefinedLiteral = literal(undefined);

    test('should validate literal undefined successfully', () => {
      const result = UndefinedLiteral.safeParse(undefined);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeUndefined();
    });

    test('should fail validation for non-literal undefined value', () => {
      const result = UndefinedLiteral.safeParse('not undefined');
      expect(result.success).toBe(false);
    });
  });

  describe('Literal Null', () => {
    const NullLiteral = literal(null);

    test('should validate literal null successfully', () => {
      const result = NullLiteral.safeParse(null);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toBeNull();
    });

    test('should fail validation for non-literal null value', () => {
      const result = NullLiteral.safeParse('not null');
      expect(result.success).toBe(false);
    });
  });

  describe('Literal Object', () => {
    const sampleObject = { key: 'value' };
    const ObjectLiteral = literal(sampleObject);

    test('should validate literal object successfully', () => {
      const result = ObjectLiteral.safeParse(sampleObject);
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual(sampleObject);
    });

    test('should fail validation for non-literal object value (different memory reference)', () => {
      const anotherObject = { key: 'value' };
      const result = ObjectLiteral.safeParse(anotherObject);
      expect(result.success).toBe(false);
    });

    test('should fail validation for non-literal object value (different content)', () => {
      const differentObject = { key: 'differentValue' };
      const result = ObjectLiteral.safeParse(differentObject);
      expect(result.success).toBe(false);
    });
  });
});
