import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { Public } from './shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Perform health check' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Health check successful.',
  })
  @ApiInternalServerErrorResponse({
    example: {
      statusCode: 500,
      message: 'Health check failed',
    },
    description: 'Health check failed',
  })
  health(): string {
    return this.appService.health();
  }
}
