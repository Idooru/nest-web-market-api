import { Logger } from "@nestjs/common";

export function loggerFactory(title: string): Logger {
  return new Logger(title);
}
