import { BadRequestException } from "@nestjs/common";
import { createZodValidationPipe } from "nestjs-zod";
import { ZodError, ZodIssue } from "zod";

function convertErrorsToKeyValues(
  details: ZodError["issues"],
): Record<string, string> {
  const formatted = {};
  details.forEach((detail: ZodIssue & { validation?: string }, i) => {
    let key = detail.path[0];
    if (detail.code === "unrecognized_keys") {
      if (!key && detail?.keys.length > 0) {
        detail.keys.forEach(
          (key) => (formatted[key] = `Invalid (${key}) parameter provided`),
        );
      } else formatted[key] = "Invalid field(s) provided";
    } else {
      const message = detail.message.split("Validation error: ");
      if (!key) {
        key = `${i}`;
      }
      formatted[key] = message
        .map((msg) => msg.trim())
        .join(" ")
        .trim();
    }
  });
  return formatted;
}

export const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new BadRequestException(convertErrorsToKeyValues(error.issues));
  },
});
