import { NestMiddleware } from "@nestjs/common";
export class UserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log("User Middleware");
    next();
  }
}
