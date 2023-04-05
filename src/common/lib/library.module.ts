import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./media-logger.library";
import { SecurityLibrary } from "./security.library";
import { TimeLoggerLibrary } from "./time-logger.library";
import { RepositoryErrorHandleLibrary } from "./repository-error-handler.library";
import { SendMailErrorHandlerLibrary } from "./send-mail-error-handler.library";

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
