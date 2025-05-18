import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiTags,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/login.dto';
import { LoginDto } from './dto/register.dto';
import { ApplyUserRoles, GetUser } from 'src/shared/decorators/user.decorator';
import { UserResponseMessages, UserRoleType } from 'src/constants/user';
import { UserRoleGuard } from 'src/shared/guards/user-role.guard';
import { AuthUser } from 'src/@types/auth';

@ApiTags('Auth')
@ApiBearerAuth('JWT')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Authenticated' })
  @ApiUnauthorizedResponse({
    description: 'Unauthenticated',
  })
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginDto: LoginDto) {
    const response = await this.service.login(loginDto);
    return response;
  }

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Account created' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiConflictResponse({
    description: UserResponseMessages.ERROR_USER_CONFLICT_ON_REGISTER,
  })
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() payload: RegisterDto) {
    const data = await this.service.registerUser(payload);
    return { data };
  }

  @Get('/me')
  @ApplyUserRoles(UserRoleType.All)
  @ApiOperation({ summary: 'Retrieve user account and profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @UseGuards(UserRoleGuard)
  @HttpCode(HttpStatus.OK)
  async me(@GetUser() user: Partial<AuthUser>) {
    return { data: user };
  }
}
