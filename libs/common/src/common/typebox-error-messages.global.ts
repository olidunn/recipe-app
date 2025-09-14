import type { ErrorFunctionParameter } from '@sinclair/typebox/errors';
import {
  DefaultErrorFunction,
  SetErrorFunction,
  ValueErrorType,
} from '@sinclair/typebox/errors';

function errorFunction(error: ErrorFunctionParameter): string {
  if (error.schema['errorMessage']) {
    return error.schema['errorMessage'];
  }

  // Nullable unions don't have good error messages yet, so we handle them here and don't return a message for null values.
  if (
    error.errorType === ValueErrorType.Union &&
    error.errors.length === 2 &&
    error.schema['nullable'] === true
  ) {
    const nonNullableErrorIterator = error.errors[0];
    const nonNullError = nonNullableErrorIterator?.First();
    if (nonNullError) {
      return nonNullError.message;
    }
  }

  if (error.errorType === ValueErrorType.StringFormat) {
    if (error.schema['format'] === 'email') {
      return 'Please enter a valid email address.';
    }
  }

  if (error.errorType === ValueErrorType.StringMinLength) {
    return `Must be at least ${error.schema['minLength']} ${error.schema['minLength'].length === 1 ? 'character' : 'characters'} in length.`;
  }

  if (error.errorType === ValueErrorType.StringMaxLength) {
    return `Must be less than ${error.schema['maxLength']} ${error.schema['maxLength'].length === 1 ? 'character' : 'characters'} in length.`;
  }

  return DefaultErrorFunction(error);
}

SetErrorFunction(errorFunction);
