import { type user as User } from '@prisma/client';
import { UserRoleType } from 'src/constants';

export type AuthUser = User;

export type AuthUserData = {
  sub: string;
  email: string;
  role: UserRoleType;
  iat: number;
  exp: number;
};

type AuthUserWithRelations<R extends keyof User = 'email'> = Required<
  Pick<User, R>
> &
  User;
