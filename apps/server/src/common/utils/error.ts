type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

function toErrorWithMessage(error: unknown): ErrorWithMessage {
  if (isErrorWithMessage(error)) {
    return error;
  }

  try {
    return new Error(JSON.stringify(error));
  } catch {
    // Fallback in case there's an error stringifying e.g. circular references.
    return new Error(String(error));
  }
}

/**
 * @returns The error.message from an unknown error caught in a catch block.
 *
 * Falls back to `JSON.stringify` and `String(error)` if the object doesn't have an error.
 */
export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}