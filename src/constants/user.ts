export enum UserResponseMessages {
  ERROR_USER_UNPROCESSABLE_ON_REGISTER = 'Your account could not be registered due to some issues.',
  ERROR_USER_CONFLICT_ON_REGISTER = 'Your account could not be registered due to some conflicts.',
}

export enum UserRoleType {
  All = '*',
  Admin = 'ADMIN',
  User = 'USER',
}
