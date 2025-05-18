import { z } from 'zod';

export const requestParameterIDSchema = z
  .string()

  .describe('Request parameter ID');
