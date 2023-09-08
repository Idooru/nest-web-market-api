import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./config/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { EmailSenderLibrary } from "./email/email-sender.library";
import { MailerConfigurationModule } from "../config/mailer.config";
import { TypeOrmErrorHandlingBuilder } from "./error-handler/typeorm-error-handling.builder";
import { LibraryErrorHandlingBuilder } from "./error-handler/library-error-handling.builder";
import { JwtErrorHandlingBuilder } from "./error-handler/jwt-error-handling.builder";
import { HttpExceptionHandlingBuilder } from "./error-handler/http-exception-handling.builder";
import { ErrorLoggerLibrary } from "./logger/error-logger.library";

@Module({
  imports: [DotenvConfigurationModule, MailerConfigurationModule],
  providers: [
    ConfigService,
    SecurityLibrary,
    EmailSenderLibrary,
    HttpExceptionHandlingBuilder,
    TypeOrmErrorHandlingBuilder,
    LibraryErrorHandlingBuilder,
    JwtErrorHandlingBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
    ErrorLoggerLibrary,
  ],
  exports: [
    SecurityLibrary,
    EmailSenderLibrary,
    HttpExceptionHandlingBuilder,
    TypeOrmErrorHandlingBuilder,
    LibraryErrorHandlingBuilder,
    JwtErrorHandlingBuilder,
    TimeLoggerLibrary,
    MeidaLoggerLibrary,
    ErrorLoggerLibrary,
  ],
})
export class LibraryModule {}
