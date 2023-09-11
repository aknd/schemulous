import { describe, expect, test } from 'vitest';
import { number, record, string } from '../src';

describe('RecordSchema', () => {
  describe('basic validation', () => {
    const StringRecord = record(string());

    test('should validate record of strings successfully', () => {
      const result = StringRecord.safeParse({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
    });

    test('should fail validation for incorrect types', () => {
      const result = StringRecord.safeParse({
        key1: 'value1',
        key2: 123, // This should be a string
        key3: 'value3',
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual(['key2']);
    });
  });

  describe('minProperties', () => {
    const MinPropertiesRecord = record(string()).minProperties(2);

    test('should validate record with enough properties', () => {
      const result = MinPropertiesRecord.safeParse({
        key1: 'value1',
        key2: 'value2',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    test('should fail validation for record with insufficient properties', () => {
      const result = MinPropertiesRecord.safeParse({
        key1: 'value1',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('maxProperties', () => {
    const MaxPropertiesRecord = record(string()).maxProperties(2);

    test('should validate record within property limit', () => {
      const result = MaxPropertiesRecord.safeParse({
        key1: 'value1',
        key2: 'value2',
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    test('should fail validation for record exceeding property limit', () => {
      const result = MaxPropertiesRecord.safeParse({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('mixed type record', () => {
    const MixedRecord = record(number());

    test('should validate record of numbers successfully', () => {
      const result = MixedRecord.safeParse({
        key1: 1,
        key2: 2,
        key3: 3,
      });
      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.data).toEqual({
        key1: 1,
        key2: 2,
        key3: 3,
      });
    });

    test('should fail validation for incorrect types in mixed record', () => {
      const result = MixedRecord.safeParse({
        key1: 1,
        key2: '2', // This should be a number
        key3: 3,
      });
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.issues[0].path).toEqual(['key2']);
    });
  });
});
