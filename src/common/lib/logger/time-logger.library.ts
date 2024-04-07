import { Request } from "express";
import { loggerFactory } from "src/common/functions/logger.factory";

export class TimeLoggerLibrary {
  private readonly startLogger = loggerFactory("TimeStart");
  private readonly endLogger = loggerFactory("TimeEnd");
  private now = 0;

  public receiveRequest(req: Request) {
    this.startLogger.log(`Receive request from ${req.method} ${req.originalUrl}`);
    this.now = Date.now();
  }

  public sendResponse(req: Request) {
    this.endLogger.log(
      `Send response from ${req.method} ${req.originalUrl} :: time taken : ${Date.now() - this.now}ms`,
    );
  }
}
