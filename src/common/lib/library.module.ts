import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "aws-sdk";
import { PromisesLibrary } from "./promises.library";
import { SecurityLibrary } from "./security.library";
import { TimeLoggerLibrary } from "./time-logger.library";

@Module({
  imports: [ConfigModule],
  providers: [
    PromisesLibrary,
    TimeLoggerLibrary,
    SecurityLibrary,
    ConfigService,
  ],
  exports: [PromisesLibrary, TimeLoggerLibrary, SecurityLibrary],
})
export class LibraryModule {}
