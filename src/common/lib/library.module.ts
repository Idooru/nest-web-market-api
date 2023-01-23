import { Module } from "@nestjs/common";
import { PromisesLibrary } from "./promises.library";
import { TimeLoggerLibrary } from "./time-logger.library";

@Module({
  imports: [],
  providers: [PromisesLibrary, TimeLoggerLibrary],
  exports: [PromisesLibrary, TimeLoggerLibrary],
})
export class LibraryModule {}
