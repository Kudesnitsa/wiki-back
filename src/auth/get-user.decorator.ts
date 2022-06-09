import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user,
);
