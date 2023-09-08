import { loggerFactory } from "src/common/functions/logger.factory";

export class ErrorLoggerLibrary {
  log({ err, firstTitle, secondTitle, className }) {
    loggerFactory(firstTitle).error(`Error occurred in ${className} class`);
    loggerFactory(secondTitle).error(err.message);
  }
}
