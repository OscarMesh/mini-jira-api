import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import {
  CONFLICT_CREDENTIALS_ON_REGISTERATION,
  USER_SERIALIZED_FIELDS,
} from 'src/shared/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/register.dto';
import { WRONG_LOGIN_CREDENTIALS } from 'src/constants/request';
import * as bcrypt from 'bcryptjs';
import { excludeFields } from 'src/shared/utils/serialize';
import { RegisterDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Login a user
   * @param dto
   * @returns {Promise<{token: string; user: Partial<User>}>} The JWT token and user object
   */

  async login({
    email,
    password,
  }: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const foundUser = await this.prismaService.user
      .findUnique({
        where: { email },
      })
      .then((user) => {
        return user;
      });

    if (!foundUser) {
      throw new BadRequestException({
        message: WRONG_LOGIN_CREDENTIALS,
      });
    }

    if (!(await bcrypt.compare(password, foundUser.password || ''))) {
      throw new BadRequestException({
        message: WRONG_LOGIN_CREDENTIALS,
      });
    }

    return {
      token: this.signUserJWT(foundUser, {
        role: foundUser.role,
      }),
      user: excludeFields(foundUser, ...[USER_SERIALIZED_FIELDS].flat(1)),
    };
  }

  /**
   * Method for registering a new user account
   *
   * @param {RegisterDto} payload
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  async registerUser(payload: RegisterDto) {
    try {
      const checkUser = await this.prismaService.user.count({
        where: {
          email: payload.email,
        },
      });

      if (checkUser > 0) {
        throw new ConflictException({
          message: CONFLICT_CREDENTIALS_ON_REGISTERATION,
        });
      }

      await this.prismaService.user.create({
        data: {
          ...payload,
          password: await bcrypt.hash(payload.password, 10),
        },
      });

      return {
        message: 'Registration successful',
      };
    } catch (error) {
      throw new BadRequestException({
        message: error?.message || 'Something went wrong',
      });
    }
  }

  /**
   * Method for signing user as a valid JWT
   *
   * @param {User} user
   * @returns {string}
   * @memberof AuthService
   */
  signUserJWT(user: User, opt: Record<string, string | number> = {}) {
    const payload = {
      sub: user.id,
      email: user.email,
      ...opt,
    };
    return this.jwtService.sign(payload);
  }
}
