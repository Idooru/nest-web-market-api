import { Logger } from "@nestjs/common";

export abstract class RepositoryLogger {
  protected readonly logger = new Logger("Repository");
}
