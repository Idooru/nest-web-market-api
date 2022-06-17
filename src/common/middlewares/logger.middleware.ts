import { NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      const { ip, originalUrl, method } = req;
      const { statusCode, statusMessage } = res;
      const logger = new Logger(originalUrl);

      if (400 <= statusCode || statusCode >= 599) {
        const logger = new Logger(`${res.statusCode}:${res.statusMessage}`);
        return logger.error(`${method} ${originalUrl}`);
      }

      return logger.log(
        `${method} ${originalUrl} ${ip} - ${statusCode} ${statusMessage}`,
      );
    });
    next();
  }
}
