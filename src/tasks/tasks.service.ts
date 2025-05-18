import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';
import { AuthUser } from 'src/@types/auth';
import { Prisma } from '@prisma/client';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RECORD_NOT_AVAILABLE } from 'src/shared';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new task
   * @param dto
   * @returns {Promise<Task>}
   */
  async createTask(user: AuthUser, dto: CreateTaskDto) {
    return await this.prismaService.task.create({
      data: {
        ...dto,
        userId: user.id,
      },
    });
  }

  /**
   * Get all tasks with pagination, filters and search
   * @param user
   * @param query
   * @returns {Promise<{data: Task[], total: number, page: number, limit: number}>}
   */
  async getTasks(user: AuthUser, query: GetTasksDto) {
    const { page = 1, limit = 10, status, priority, search } = query;
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const where: Prisma.TaskWhereInput = {
      userId: user.id,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      deletedAt: null,
    };

    const [tasks, total] = await Promise.all([
      this.prismaService.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.task.count({ where }),
    ]);

    return {
      data: tasks,
      total,
      page,
      limit,
    };
  }

  /**
   * Get a task by id
   * @param user
   * @param id
   * @returns {Promise<Task>}
   */
  async getTaskById(user: AuthUser, id: string) {
    const task = await this.prismaService.task.findFirstOrThrow({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });

    return task;
  }

  /**
   * Update a task by id
   * @param user
   * @param id
   * @param dto
   * @returns {Promise<Task>}
   */
  async updateTask(user: AuthUser, id: string, dto: UpdateTaskDto) {
    const existingTask = await this.prismaService.task.findUnique({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!existingTask) {
      throw new NotFoundException({
        message: RECORD_NOT_AVAILABLE,
      });
    }

    return await this.prismaService.task.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  /**
   * Delete a task by id
   * @param user
   * @param id
   * @returns {Promise<Task>}
   */
  async deleteTask(user: AuthUser, id: string) {
    const existingTask = await this.prismaService.task.findUnique({
      where: {
        id,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (!existingTask) {
      throw new NotFoundException({
        message: RECORD_NOT_AVAILABLE,
      });
    }

    return await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
