type ErrorName =
  | 'GET_AUTH_ERROR'
  | 'GET_AUTH_CONFIRM_TOKEN_ERROR'
  | 'EXCEPTIONAL_ERROR';

export class BaseError<T extends string> extends Error {
  override name: T;
  override message: string;
  cause: any;

  constructor({ name, message, cause }: {
    name: T;
    message: string;
    cause?: any;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export async function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
