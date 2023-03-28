import { Logger } from "@nestjs/common";

export abstract class SendMailLogger {
  protected readonly logger = new Logger("SendMailService");
}
