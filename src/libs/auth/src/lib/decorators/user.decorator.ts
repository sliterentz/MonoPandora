import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity as User } from '../entities';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
