import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { MeidaLoggerLibrary } from "./media-logger.library";
import { PromiseLibrary } from "./promise.library";
import { SecurityLibrary } from "./security.library";
import { TimeLoggerLibrary } from "./time-logger.library";

@Module({
  imports: [DotenvConfigurationModule],
  providers: [
    PromiseLibrary,
    TimeLoggerLibrary,
    SecurityLibrary,
    ConfigService,
    MeidaLoggerLibrary,
  ],
  exports: [
    PromiseLibrary,
    TimeLoggerLibrary,
    SecurityLibrary,
    MeidaLoggerLibrary,
  ],
})
export class LibraryModule {}
