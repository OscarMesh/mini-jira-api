import { environmentSchema } from "src/config";
import { z } from "zod";

export type EnvironmentSchemaType = z.infer<typeof environmentSchema>;
