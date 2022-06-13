import { NestMiddleware } from "@nestjs/common";
export class ProductMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log("Product Middleware");
    next();
  }
}
