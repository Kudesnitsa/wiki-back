import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    if (!roles.includes(context.switchToHttp().getRequest().user.role.title)) {
      throw new ForbiddenException();
    }
    return roles.includes(context.switchToHttp().getRequest().user.role.title);
  }
}
