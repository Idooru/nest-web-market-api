import { Injectable, Logger } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class TimeLoggerLibrary {
  private readonly logger = new Logger("Time");
  private now = 0;

  receiveRequest(req: Request) {
    this.logger.log(`Receive request from ${req.method} ${req.originalUrl}`);
    this.now = Date.now();
  }

  sendResponse(req: Request) {
    this.logger.log(
      `Send response from ${req.method} ${req.originalUrl} :: time taken : ${
        Date.now() - this.now
      }ms`,
    );
  }
}
