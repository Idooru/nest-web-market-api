import { NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class ResponseLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const { ip, originalUrl, method } = req;
      const { statusCode, statusMessage } = res;
      let logger: Logger;

      if (400 <= statusCode || statusCode >= 599) {
        logger = new Logger("Fail");
        logger.error(
          `${method} ${originalUrl} ${ip} - ${statusCode} ${statusMessage}`,
        );
      } else {
        logger = new Logger("Success");
        logger.log(
          `${method} ${originalUrl} ${ip} - ${statusCode} ${statusMessage}`,
        );
      }
    });

    next();
  }
}
