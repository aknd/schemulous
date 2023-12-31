export const getType = (value: unknown): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (typeof value === 'function') return 'function';

  return typeof value;
};

export const safeParsePlainObject = (
  value: unknown
): { [key: string]: unknown } | null => {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    value instanceof Date
  ) {
    return null;
  }

  return value as { [key: string]: unknown };
};

export const capitalize = (str?: string): string => {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
};

export const pick = <T extends { [k: string]: unknown }, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, (typeof keys)[number]> => {
  const result: Partial<T> = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });

  return result as Pick<T, (typeof keys)[number]>;
};

export const plainDeepCopy = <T>(obj: T): T => {
  if (obj === null) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return obj.map((item) => plainDeepCopy(item)) as any;
  }

  const copiedObj: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copiedObj[key] = plainDeepCopy(obj[key]);
    }
  }

  return copiedObj as T;
};
