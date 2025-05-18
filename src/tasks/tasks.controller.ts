import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthUser } from 'src/@types/auth';
import { ApplyUserRoles, GetUser } from 'src/shared/decorators/user.decorator';
import { UserRoleGuard } from 'src/shared';
import { UserRoleType } from 'src/constants/user';
import { GetTasksDto } from './dto/get-tasks.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { requestParameterIDSchema } from 'src/shared/dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Tasks')
@ApiBearerAuth('JWT')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApplyUserRoles(UserRoleType.All)
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Task created' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiConflictResponse({
    description: 'Task already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() dto: CreateTaskDto,
    @GetUser() user: Partial<AuthUser>,
  ) {
    const data = await this.tasksService.createTask(user, dto);
    return { data };
  }

  @Get()
  @ApplyUserRoles(UserRoleType.All)
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tasks fetched' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @HttpCode(HttpStatus.OK)
  async getTasks(
    @GetUser() user: Partial<AuthUser>,
    @Query() query: GetTasksDto,
  ) {
    const data = await this.tasksService.getTasks(user, query);
    return { data };
  }

  @Get(':id')
  @ApplyUserRoles(UserRoleType.All)
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task fetched' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @HttpCode(HttpStatus.OK)
  async getTaskById(
    @GetUser() user: Partial<AuthUser>,
    @Param('id', new ZodValidationPipe(requestParameterIDSchema)) id: string,
  ) {
    const data = await this.tasksService.getTaskById(user, id);
    return { data };
  }

  @Put(':id')
  @ApplyUserRoles(UserRoleType.All)
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Update a task by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task updated' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @GetUser() user: Partial<AuthUser>,
    @Param('id', new ZodValidationPipe(requestParameterIDSchema)) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const data = await this.tasksService.updateTask(user, id, dto);
    return { data };
  }

  @Delete(':id')
  @ApplyUserRoles(UserRoleType.All)
  @UseGuards(UserRoleGuard)
  @ApiOperation({ summary: 'Delete a task by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task deleted' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @GetUser() user: Partial<AuthUser>,
    @Param('id', new ZodValidationPipe(requestParameterIDSchema)) id: string,
  ) {
    const data = await this.tasksService.deleteTask(user, id);
    return { data };
  }
}
