import { ConfigService } from "@nestjs/config";
import { EnvironmentSchemaType } from "src/@types";

export function allowedHeaders(): string[] {
  const configService = new ConfigService();
  const clientOrigins = configService
    .get<EnvironmentSchemaType["CLIENT_CORS_ORIGINS"]>(
      "CLIENT_CORS_ORIGINS",
      "",
    )
    .split(",")
    .filter(Boolean)
    .map((origin) => origin.trim());
  return clientOrigins;
}
