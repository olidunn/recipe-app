import type { Static, TObject } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export type ErrorByName<Schema extends TObject> = Partial<
  Record<keyof Schema['static'], { message: string | undefined }>
>;

type SuccessResult = {
  failed: false;
};

type FailureResult<Schema extends TObject> = {
  failed: true;
  errorByName: ErrorByName<Schema>;
};

export function validate<Schema extends TObject>(
  data: Static<Schema>,
  schema: Schema,
): SuccessResult | FailureResult<Schema> {
  if (Value.Check(schema, data)) {
    return { failed: false };
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
