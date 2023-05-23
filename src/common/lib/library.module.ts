import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./config/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { EmailSenderLibrary } from "./email/email-sender.library";
import { MailerConfigurationModule } from "../config/mailer.config";
import { TypeOrmErrorHandlerBuilder } from "./error-handler/typeorm-error-handler.builder";
import { LibraryErrorHandlerBuilder } from "./error-handler/library-error-handler.builder";
import { JwtErrorHandlerBuilder } from "./error-handler/jwt-error-handling.builder";

@Module({
  imports: [DotenvConfigurationModule, MailerConfigurationModule],
  providers: [
    ConfigService,
    SecurityLibrary,
    EmailSenderLibrary,
    TypeOrmErrorHandlerBuilder,
    LibraryErrorHandlerBuilder,
    JwtErrorHandlerBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
  ],
  exports: [
    SecurityLibrary,
    EmailSenderLibrary,
    TypeOrmErrorHandlerBuilder,
    LibraryErrorHandlerBuilder,
    JwtErrorHandlerBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
  ],
})
export class LibraryModule {}
