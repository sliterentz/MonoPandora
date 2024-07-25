export enum ErrorType {
  InvalidToken = 'INVALID_TOKEN',
  AccessTokenExpired = 'ACCESS_TOKEN_EXPIRED',
  RefreshTokenExpired = 'REFRESH_TOKEN_EXPIRED',
  PermissionExists = 'PERMISSION_EXISTS',
  RoleExists = 'ROLE_EXISTS',
  UserExists = 'USER_EXISTS',
  EmailExists = 'EMAIL_EXISTS',
  PhoneExists = 'PHONE_EXISTS',
  NoUserDataExists = 'NO_USER_DATA_EXISTS',
  InvalidCurrentPassword = 'INVALID_CURRENT_PASSWORD',
  InvalidCredentials = 'INVALID_CREDENTIALS',
  BlockedUser = 'BLOCKED_USER',
  InactiveUser = 'INACTIVE_USER',
  ForeignKeyConflict = 'FOREIGN_KEY_CONFLICT',
}

export enum DBErrorCode {
  PgNotNullConstraintViolation = '23502',
  PgForeignKeyConstraintViolation = '23503',
  PgUniqueConstraintViolation = '23505',
}

export interface DBError extends Error {
  code?: string;
  detail?: string;
}

export enum TokenError {
  JsonWebTokenError = 'JsonWebTokenError',
  TokenExpiredError = 'TokenExpiredError',
  SyntaxError = 'SyntaxError',
}

// type ErrorName =
//   | 'GET_AUTH_ERROR'
//   | 'GET_AUTH_CONFIRM_TOKEN_ERROR'
//   | 'EXCEPTIONAL_ERROR';

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
