import type { TSchema } from 'elysia';
import { t } from 'elysia';

/**
 * Utility function to create a nullable schema. This is because TypeBox does not
 * make error messages for nullable schemas easily accessible.
 */
export function Nullable<T extends TSchema>(schema: T) {
  return t.Union([schema, t.Null()], { nullable: true });
}

export function IntegerPrimaryKey() {
  return t.Number({
    exclusiveMinimum: 0,
    readOnly: true,
  });
}

export function IntegerForeignKey(options: { readOnly?: boolean } = {}) {
  return t.Number({
    ...options,
    exclusiveMinimum: 0,
  });
}

export function Timestamp() {
  return t.Number({
    exclusiveMinimum: 0,
    readOnly: true,
  });
}
