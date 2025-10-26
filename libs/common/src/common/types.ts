/**
 * Replace shared properties in the first type with those in the second type.
 * The second type must have property keys existing on the first type but can only have a subtype value.
 */
export type StrictOverride<T1 extends object, T2 extends Partial<T1>> = Omit<
  T1,
  keyof T2
> &
  T2;

/**
 * Replace shared properties in the first type with those in the second type.
 * The second type must have property keys existing on the first type and can have any value type.
 */
export type Override<
  T1 extends object,
  T2 extends Partial<Record<keyof T1, unknown>>,
> = Omit<T1, keyof T2> & T2;

/**
 * Construct a type with the properties of T except for those in type K.
 * Except this time it actually checks what keys you use.
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
