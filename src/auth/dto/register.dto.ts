import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.preprocess((arg, ctx) => {
    if (typeof arg !== 'string') return undefined;
    if (arg.includes('+')) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid email address',
      });

      return arg;
    }
    return arg;
  }, z.string().email()),
  password: z.string().min(8),
});

// class is required for using DTO as a type
export class LoginDto extends createZodDto(LoginSchema) {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  password: string;
}
