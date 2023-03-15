import { Logger } from "@nestjs/common";

export abstract class RepositoryLogger {
  constructor(private readonly repository: string) {}

  protected readonly logger = new Logger(`${this.repository} Repository`);
}
