import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DotenvConfigurationModule } from "../config/dotenv.config";
import { CookieLibrary } from "./cookie.library";
import { MeidaLoggerLibrary } from "./media-logger.library";
import { PromiseLibrary } from "./promise.library";
import { SecurityLibrary } from "./security.library";
import { TimeLoggerLibrary } from "./time-logger.library";

@Module({
  imports: [DotenvConfigurationModule],
  providers: [
    CookieLibrary,
    PromiseLibrary,
    TimeLoggerLibrary,
    SecurityLibrary,
    ConfigService,
    MeidaLoggerLibrary,
  ],
  exports: [
    CookieLibrary,
    PromiseLibrary,
    TimeLoggerLibrary,
    SecurityLibrary,
    MeidaLoggerLibrary,
  ],
})
export class LibraryModule {}
