// import { ProductMiddleware } from "../../lib/middlewares/product.middleware";
// import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
// import { ProductController } from "../product/controllers/product.controller";
// import { ProductService } from "../product/services/product.service";
// import { TypeOrmModule } from "@nestjs/typeorm";

// @Module({
//   imports: [],
//   controllers: [ProductController],
//   providers: [ProductService],
// })
// export class ProductModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(ProductMiddleware).forRoutes("product");
//   }
// }
