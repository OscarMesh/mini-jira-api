import { Logger } from '@nestjs/common';
import { AppEnvironment } from 'src/constants';
import z from 'zod';
import { errorMap } from 'zod-validation-error';

z.setErrorMap(errorMap);

const logger = new Logger();

export const environmentSchema = z.object({
  APP_ENV: z
    .enum([AppEnvironment.Local, AppEnvironment.Production])
    .default(AppEnvironment.Local),

  DATABASE_URL: z.string(),
  JWT_EXPIRES: z.coerce.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number(),
  CLIENT_CORS_ORIGINS: z.string(),
  // AUTH_PASSWORD_RESET_TTL: z.coerce.number(),
  // AUTH_EMAIL_VERIFICATION_TTL: z.coerce.number(),
});

/**
 *  Parse and validate the loaded environment variables
 *  @returns {EnvironmentSchema}
 * @export
 */
export function loadVariablesFromEnvironment() {
  try {
    return environmentSchema.parse({
      ...process.env,
    });
  } catch (error) {
    logger.error('Invalid Environment variables set: ' + error);
    process.exit(1);
  } finally {
  }
}
