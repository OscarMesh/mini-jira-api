import {
  createParamDecorator,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { AuthUser } from 'src/@types';
import {
  APPLY_USER_RELATIONS,
  APPLY_USER_ROLES,
  ERROR_USER_UNAUTHORIZED,
  USER_SERIALIZED_FIELDS,
} from '../constants';
import { excludeFields } from '../utils';

export const GetUserID = createParamDecorator((data, req): UserModel => {
  return req.switchToHttp().getRequest().userId;
});

export const GetUser = createParamDecorator(
  (
    args: Array<string> | false = USER_SERIALIZED_FIELDS,
    req,
  ): Partial<AuthUser> => {
    const user = req.switchToHttp().getRequest().user;

    if (!user) {
      throw new UnauthorizedException({ message: ERROR_USER_UNAUTHORIZED });
    }

    if (args === false) {
      return user;
    }

    return excludeFields(user, ...args);
  },
);

export const GetUserOptional = createParamDecorator(
  (
    args: Array<string> | false = USER_SERIALIZED_FIELDS,
    req,
  ): Partial<AuthUser> | null => {
    const user = req.switchToHttp().getRequest().user;

    if (!user) {
      return null;
    }

    if (args === false) {
      return user;
    }

    return excludeFields(user, ...args);
  },
);

export const ApplyUserRoles = (...roles: string[]) => {
  return SetMetadata(APPLY_USER_ROLES, roles);
};
