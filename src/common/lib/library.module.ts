import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./config/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { SendEmailLibrary } from "./email/send-email-library";
import { MailerConfigurationModule } from "../config/mailer.config";
import { ErrorHandlerBuilder } from "./error-handler/error-hanlder-builder";

@Module({
  imports: [DotenvConfigurationModule, MailerConfigurationModule],
  providers: [
    ConfigService,
    SecurityLibrary,
    SendEmailLibrary,
    ErrorHandlerBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
  ],
  exports: [
    SecurityLibrary,
    SendEmailLibrary,
    ErrorHandlerBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
  ],
})
export class LibraryModule {}
