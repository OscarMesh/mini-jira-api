import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {
  @ApiProperty({ required: true, example: `john.doe@example.com` })
  email: string;

  @ApiProperty({ required: true, example: `12345678` })
  password: string;

  @ApiProperty({ required: true, example: `John Doe` })
  name: string;
}
