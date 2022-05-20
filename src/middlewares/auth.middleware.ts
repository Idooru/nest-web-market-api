import { NestMiddleware } from "@nestjs/common";
export class AuthMiddlware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log("Auth Middleware");
    next();
  }
}
