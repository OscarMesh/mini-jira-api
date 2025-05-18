import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .default(TaskStatus.TODO),
  priority: z
    .enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
    .default(TaskPriority.MEDIUM),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {
  @ApiProperty({ required: true, example: 'Buy groceries' })
  title: string;

  @ApiProperty({ required: false, example: 'Buy groceries' })
  description: string;

  @ApiProperty({ required: false, example: `TODO | IN_PROGRESS | DONE` })
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @ApiProperty({ required: false, example: `LOW | MEDIUM | HIGH` })
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
