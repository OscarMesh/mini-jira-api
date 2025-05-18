import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const GetTasksSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .optional(),
  priority: z
    .enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
    .optional(),
  search: z.string().optional(),
});

export class GetTasksDto extends createZodDto(GetTasksSchema) {
  @ApiProperty({ required: false, example: 1 })
  page: number;

  @ApiProperty({ required: false, example: 10 })
  limit: number;

  @ApiProperty({ required: false, example: 'TODO | IN_PROGRESS | DONE' })
  status?: TaskStatus;

  @ApiProperty({ required: false, example: 'LOW | MEDIUM | HIGH' })
  priority?: TaskPriority;

  @ApiProperty({ required: false, example: 'Search term' })
  search?: string;
}
