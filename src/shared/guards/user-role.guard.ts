import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  APPLY_USER_ROLES,
  ERROR_USER_FORBIDDEN,
  IS_PUBLIC_KEY,
} from '../constants';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const currentRole = request.user.role;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ROLES = this.reflector.getAllAndOverride<string[] | undefined>(
      APPLY_USER_ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!Array.isArray(ROLES) || typeof ROLES === 'undefined') {
      throw new ForbiddenException({
        message: ERROR_USER_FORBIDDEN,
      });
    }

    if (ROLES.includes(currentRole) || ROLES.includes('*')) {
      return true;
    }

    throw new ForbiddenException({
      message: ERROR_USER_FORBIDDEN,
    });
  }
}
