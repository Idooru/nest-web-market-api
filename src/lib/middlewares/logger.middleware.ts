import { NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const { statusCode, statusMessage } = res;
    const userAgent = req.get("user-agent") || "";
    const contentLength = res.get("content-length");
    res.on("finish", () => {
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${statusMessage} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    next();
  }
}
