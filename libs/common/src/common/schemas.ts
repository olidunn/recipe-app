import type { TSchema } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox/type';

/**
 * Utility function to create a nullable schema. This is because TypeBox does not
 * make error messages for nullable schemas easily accessible.
 */
export function Nullable<T extends TSchema>(schema: T) {
  return Type.Union([schema, Type.Null()], { nullable: true });
}

export function IntegerPrimaryKey() {
  return Type.Number({
    exclusiveMinimum: 0,
    readOnly: true,
  });
}

export function IntegerForeignKey(options: { readOnly?: boolean } = {}) {
  return Type.Number({
    ...options,
    exclusiveMinimum: 0,
  });
}

export function Timestamp() {
  return Type.Number({
    exclusiveMinimum: 0,
    readOnly: true,
  });
}

export function HexColor() {
  return Type.String({
    pattern: '^#([0-9a-fA-F]{3}){1,2}$',
    errorMessage:
      'Color must be a valid 3 or 6 digit hex code (e.g. #f00 or #FF0000)',
  });
}
