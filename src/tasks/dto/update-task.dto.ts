import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .optional(),
  priority: z
    .enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
    .optional(),
});

export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {
  @ApiProperty({ required: false, example: 'Buy groceries' })
  title: string;

  @ApiProperty({ required: false, example: 'Buy groceries' })
  description: string;

  @ApiProperty({ required: false, example: `TODO | IN_PROGRESS | DONE` })
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @ApiProperty({ required: false, example: `LOW | MEDIUM | HIGH` })
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
