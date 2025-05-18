export enum AuthenticationResponseStatus {
  EXPIRED_TOKEN = "Expired authorization token",
  INVALID_TOKEN = "Invalid authorization token",
  NOT_AUTHORIZED = "Not authorized/missing authorization token",
  FAILED = "Authorization attempt not successful",
}

export const ERROR_USER_UNAUTHORIZED = "You are not authorized to proceed";
export const ERROR_USER_FORBIDDEN =
  "You are not permitted to access this resource";
export const ERROR_DUPLICATE_EMAIL_VERIFICATION_SESSION =
  "Verification email already sent";
export const ERROR_USER_ALREADY_VERIFIED_BY_EMAIL = "Email already verified";
