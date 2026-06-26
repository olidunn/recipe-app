import type { Static, TSchema } from '@sinclair/typebox';
import type { TypeCheck } from '@sinclair/typebox/compiler';
import { Value } from '@sinclair/typebox/value';

export type ErrorByName<Schema extends TSchema> = Partial<
  Record<keyof Schema['static'], { message: string | undefined }>
>;

type SuccessResult<Schema extends TSchema> = {
  failed: false;
  data: Schema['static'];
};

type FailureResult<Schema extends TSchema> = {
  failed: true;
  errorByName: ErrorByName<Schema>;
};

export function validate<Schema extends TSchema>(
  // Remove?
  data: Record<string, unknown>,
  checker: TypeCheck<Schema>,
): SuccessResult<Schema> | FailureResult<Schema> {
  if (checker.Check(data)) {
    return { failed: false, data };
  }

  const errorByName: ErrorByName<Schema> = {};

  for (const error of checker.Errors(data)) {
    // slice to get rid of the leading '/'
    errorByName[error.path.slice(1) as keyof Schema['static']] = error;
  }

  return {
    failed: true,
    errorByName,
  };
}

export function validateObject<Schema extends TSchema>(
  data: Static<Schema>,
  schema: Schema,
): SuccessResult<Schema> | FailureResult<Schema> {
  if (Value.Check(schema, data)) {
    return { failed: false, data };
  }

  const errorByName: ErrorByName<Schema> = {};

  for (const error of Value.Errors(schema, data)) {
    // slice to get rid of the leading '/'
    errorByName[error.path.slice(1) as keyof Schema['static']] = error;
  }

  return {
    failed: true,
    errorByName,
  };
}
