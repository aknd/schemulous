import { string } from './src/core';
import { safeParse } from './src/extensions';

const stringSchema = string();

const result01 = safeParse(stringSchema, '123');
result01;

const result02 = safeParse(stringSchema, 123);
if (!result02.success) {
  const issues02 = result02.error!.issues;
  issues02[0].code;
  issues02[0].expected;
  issues02[0].message;
  issues02[0].path;
  issues02[0].received;
}
