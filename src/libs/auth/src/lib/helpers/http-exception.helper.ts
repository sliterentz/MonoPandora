import { ConflictException, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ErrorType } from '../types';

export class ForeignKeyConflictException extends ConflictException {
  constructor() {
    super({
      errorType: ErrorType.ForeignKeyConflict,
      message: `Foreign key conflict`,
    });
  }
}

export class RoleExistsException extends ConflictException {
  constructor(roleName: string) {
    super({
      errorType: ErrorType.RoleExists,
      message: `There's a role with name '${roleName}'`,
    });
  }
}

export class PermissionExistsException extends ConflictException {
  constructor(permissionName: string) {
    super({
      errorType: ErrorType.PermissionExists,
      message: `There's a permission with slug '${permissionName}'`,
    });
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super({ errorType: ErrorType.InvalidToken });
  }
}

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.AccessTokenExpired,
      message: 'Access token has expired',
    });
  }
}

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.RefreshTokenExpired,
      message: 'Refresh token has expired',
    });
  }
}

export class UserExistsException extends ConflictException {
  constructor(username: string) {
    super({
      errorType: ErrorType.UserExists,
      message: `There's a user with username '${username}'`,
    });
  }
}

export class EmailExistsException extends ConflictException {
  constructor(email: string) {
    super({
      errorType: ErrorType.EmailExists,
      message: `There's a user with email '${email}'`,
    });
  }
}

export class PhoneExistsException extends ConflictException {
  constructor(phone: string) {
    super({
      errorType: ErrorType.PhoneExists,
      message: `There's a user with phone '${phone}'`,
    });
  }
}

export class InvalidCurrentPasswordException extends ForbiddenException {
  constructor() {
    super({
      errorType: ErrorType.InvalidCurrentPassword,
      message: 'The current password is invalid',
    });
  }
}

export class DisabledUserException extends UnauthorizedException {
  constructor(errorType: ErrorType) {
    super({
      errorType,
      message: 'User not authorized to login',
    });
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.InvalidCredentials,
      message: 'Invalid credentials',
    });
  }
}

export class NotFoundUserException extends NotFoundException {
  constructor() {
    super({
      errorType: ErrorType.NoUserDataExists,
      message: 'No data user exists',
    });
  }
}