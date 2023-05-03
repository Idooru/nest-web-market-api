import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./config/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { EmailSenderLibrary } from "./email/email-sender.library";
import { MailerConfigurationModule } from "../config/mailer.config";
import { ErrorHandlerBuilder } from "./error-handler/error-hanlder.builder";

@Module({
  imports: [DotenvConfigurationModule, MailerConfigurationModule],
  providers: [
    ConfigService,
    SecurityLibrary,
    EmailSenderLibrary,
    ErrorHandlerBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
  ],
  exports: [
    SecurityLibrary,
    EmailSenderLibrary,
    ErrorHandlerBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
  ],
})
export class LibraryModule {}
