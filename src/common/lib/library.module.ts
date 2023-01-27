import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "aws-sdk";
import { PromiseLibrary } from "./promise.library";
import { SecurityLibrary } from "./security.library";
import { TimeLoggerLibrary } from "./time-logger.library";

@Module({
  imports: [ConfigModule],
  providers: [
    PromiseLibrary,
    TimeLoggerLibrary,
    SecurityLibrary,
    ConfigService,
  ],
  exports: [PromiseLibrary, TimeLoggerLibrary, SecurityLibrary],
})
export class LibraryModule {}
