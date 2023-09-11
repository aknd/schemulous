import { describe, expect, test } from 'vitest';
import { number } from '../src';

describe('NumberSchema', () => {
  describe('int', () => {
    test('should validate integer successfully', () => {
      const result = number().int().safeParse(123);
      expect(result.success).toBe(true);
    });

    test('should fail integer validation', () => {
      const result = number().int().safeParse(123.45);
      expect(result.success).toBe(false);
    });
  });

  describe('minimum', () => {
    test('should validate number greater than minimum successfully', () => {
      const result = number().minimum(5).safeParse(6);
      expect(result.success).toBe(true);
    });

    test('should fail validation for number less than minimum', () => {
      const result = number().minimum(5).safeParse(4);
      expect(result.success).toBe(false);
    });
  });

  describe('minimum with exclusive', () => {
    test('should validate number greater than minimum (exclusive) successfully', () => {
      const result = number().minimum(5).exclusive().safeParse(5.1);
      expect(result.success).toBe(true);
    });

    test('should fail validation for number equal to minimum (exclusive)', () => {
      const result = number().minimum(5).exclusive().safeParse(5);
      expect(result.success).toBe(false);
    });
  });

  describe('maximum', () => {
    test('should validate number less than maximum successfully', () => {
      const result = number().maximum(5).safeParse(4);
      expect(result.success).toBe(true);
    });

    test('should fail validation for number greater than maximum', () => {
      const result = number().maximum(5).safeParse(6);
      expect(result.success).toBe(false);
    });
  });

  describe('maximum with exclusive', () => {
    test('should validate number less than maximum (exclusive) successfully', () => {
      const result = number().maximum(5).exclusive().safeParse(4.9);
      expect(result.success).toBe(true);
    });

    test('should fail validation for number equal to maximum (exclusive)', () => {
      const result = number().maximum(5).exclusive().safeParse(5);
      expect(result.success).toBe(false);
    });
  });

  describe('multipleOf', () => {
    test('should validate number that is a multiple successfully', () => {
      const result = number().multipleOf(5).safeParse(10);
      expect(result.success).toBe(true);
    });

    test('should fail validation for number that is not a multiple', () => {
      const result = number().multipleOf(5).safeParse(7);
      expect(result.success).toBe(false);
    });
  });
});
