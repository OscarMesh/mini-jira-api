import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { EnvironmentSchemaType } from 'src/@types';
import { AuthenticationResponseStatus, IS_PUBLIC_KEY } from '../constants';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  logger = new Logger(AuthGuard.name);

  @Inject()
  configService: ConfigService;

  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    return ctx.getRequest();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      const secret =
        this.configService.getOrThrow<EnvironmentSchemaType['JWT_SECRET']>(
          'JWT_SECRET',
        );

      const request = this.getRequest(context);
      const sessionToken = request.cookies['__session'];
      const headerToken = request.headers['authorization'];

      let token = sessionToken || headerToken;

      if (!token || typeof token !== 'string') {
        throw new JsonWebTokenError('No authorization token provided.');
      }

      token = token.replaceAll('Bearer', '').trim();

      const validate: (jwt.JwtPayload & any) | string = jwt.verify(
        token,
        secret,
      );

      request.userId = validate.sub;
      request.authData = validate;
      return true;
    } catch (error) {
      let message = error?.message || AuthenticationResponseStatus.FAILED;
      if (error instanceof JsonWebTokenError) {
        message = error.message || AuthenticationResponseStatus.INVALID_TOKEN;
      }

      if (error instanceof TokenExpiredError) {
        message = AuthenticationResponseStatus.EXPIRED_TOKEN;
      }

      throw new UnauthorizedException({
        message,
      });
    }
  }
}
