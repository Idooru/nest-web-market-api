import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./logger/media-logger.library";
import { SecurityLibrary } from "./config/security.library";
import { TimeLoggerLibrary } from "./logger/time-logger.library";
import { RepositoryErrorHandleLibrary } from "./error-handler/repository-error-handler.library";
import { SendMailErrorHandlerLibrary } from "./error-handler/send-mail-error-handler.library";

@Module({
  imports: [DotenvConfigurationModule],
  providers: [
    TimeLoggerLibrary,
    ConfigService,
    SecurityLibrary,
    MeidaLoggerLibrary,
    RepositoryErrorHandleLibrary,
    SendMailErrorHandlerLibrary,
  ],
  exports: [
    TimeLoggerLibrary,
    SecurityLibrary,
    MeidaLoggerLibrary,
    RepositoryErrorHandleLibrary,
    SendMailErrorHandlerLibrary,
  ],
})
export class LibraryModule {}
