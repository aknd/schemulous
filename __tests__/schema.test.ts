import { describe, expect, test } from 'vitest';
import { array, date, enumType, number, object, string } from '../src';

describe('Schema', () => {
  // String
  describe('string', () => {
    describe('optional', () => {
      test('should validate successfully', () => {
        const result = string().optional().safeParse('abcdef');
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = string().optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('nullable', () => {
      test('should validate successfully', () => {
        const result = string().nullable().safeParse('abcdef');
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = string().nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('nullish', () => {
      test('should validate successfully', () => {
        const result = string().nullish().safeParse('abcdef');
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = string().nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = string().nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const result = string().default('default-value').safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe('default-value');
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackValue = 'fallback';
        const result = string()
          .minLength(8)
          .catch(() => fallbackValue)
          .safeParse('abc');
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(fallbackValue);
      });
    });
  });

  // Number
  describe('number', () => {
    describe('optional', () => {
      test('should validate successfully', () => {
        const result = number().optional().safeParse(123);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = number().optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('nullable', () => {
      test('should validate successfully', () => {
        const result = number().nullable().safeParse(123);
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = number().nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('nullish', () => {
      test('should validate successfully', () => {
        const result = number().nullish().safeParse(123);
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = number().nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = number().nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const result = number().default(100).safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(100);
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackValue = 100;
        const result = number()
          .minimum(10)
          .catch(() => fallbackValue)
          .safeParse(5);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(fallbackValue);
      });
    });
  });

  // Date
  describe('date', () => {
    describe('optional', () => {
      test('should validate successfully', () => {
        const result = date().optional().safeParse(new Date());
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = date().optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('nullable', () => {
      test('should validate successfully', () => {
        const result = date().nullable().safeParse(new Date());
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = date().nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('nullish', () => {
      test('should validate successfully', () => {
        const result = date().nullish().safeParse(new Date());
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = date().nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = date().nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const defaultDate = new Date('2023-09-11');
        const result = date().default(defaultDate).safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toEqual(defaultDate);
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackDate = new Date('2023-09-11');
        const result = date()
          .catch(() => fallbackDate)
          .safeParse(null);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toEqual(fallbackDate);
      });
    });
  });

  // Object
  describe('object', () => {
    const objSchema = object({
      name: string(),
      age: number().int(),
      birthdate: date(),
      hobbies: array(string()),
    });

    describe('optional', () => {
      test('should validate successfully', () => {
        const result = objSchema.optional().safeParse({
          name: 'John',
          age: 30,
          birthdate: new Date('1993-09-11'),
          hobbies: ['reading', 'swimming'],
        });
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = objSchema.optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    // TODO: Add tests
  });

  // Array
  describe('array', () => {
    const arrSchema = array(string());

    describe('optional', () => {
      test('should validate successfully', () => {
        const result = arrSchema.optional().safeParse(['apple', 'banana']);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = arrSchema.optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('nullable', () => {
      test('should validate successfully', () => {
        const result = array(string())
          .nullable()
          .safeParse(['apple', 'banana']);
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = array(string()).nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('nullish', () => {
      test('should validate successfully', () => {
        const result = array(string()).nullish().safeParse(['apple', 'orange']);
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = array(string()).nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = array(string()).nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const result = array(string())
          .default(['default-item'])
          .safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toEqual(['default-item']);
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackValue = ['fallback-item'];
        const result = array(string().minLength(8))
          .catch(() => fallbackValue)
          .safeParse(['short']);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toEqual(fallbackValue);
      });
    });
  });

  // EnumType
  describe('enumType', () => {
    const Gender = enumType(['Male', 'Female', 'Other']);

    describe('optional', () => {
      test('should validate successfully', () => {
        const result = Gender.optional().safeParse('Male');
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = Gender.optional().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('nullable', () => {
      test('should validate successfully', () => {
        const result = Gender.nullable().safeParse('Female');
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = Gender.nullable().safeParse(null);
        expect(result.success).toBe(true);
      });
    });

    describe('nullish', () => {
      test('should validate successfully', () => {
        const result = Gender.nullish().safeParse('Other');
        expect(result.success).toBe(true);
      });

      test('should validate null successfully', () => {
        const result = Gender.nullish().safeParse(null);
        expect(result.success).toBe(true);
      });

      test('should validate undefined successfully', () => {
        const result = Gender.nullish().safeParse(undefined);
        expect(result.success).toBe(true);
      });
    });

    describe('default', () => {
      test('should return default value', () => {
        const result = Gender.default('Other').safeParse(undefined);
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe('Other');
      });
    });

    describe('catch', () => {
      test('should catch and return fallback value', () => {
        const fallbackValue = 'Other';
        const result = Gender.catch(() => fallbackValue).safeParse('Unknown');
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.data).toBe(fallbackValue);
      });
    });
  });
});
