import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./media-logger.library";
import { SecurityLibrary } from "./security.library";
import { TimeLoggerLibrary } from "./time-logger.library";
import { RepositoryErrorHandleLibrary } from "./repository-error-handler.library";

@Module({
  imports: [DotenvConfigurationModule],
  providers: [
    TimeLoggerLibrary,
    SecurityLibrary,
    ConfigService,
    MeidaLoggerLibrary,
    RepositoryErrorHandleLibrary,
  ],
  exports: [
    TimeLoggerLibrary,
    SecurityLibrary,
    MeidaLoggerLibrary,
    RepositoryErrorHandleLibrary,
  ],
})
export class LibraryModule {}
