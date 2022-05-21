import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./model/auth/auth.module";
import { UserModule } from "./model/user/user.module";
import { ProductModule } from "./model/product/product.module";
import { AuthService } from "./model/auth/auth.service";
import { UserService } from "./model/user/user.service";
import { ProductService } from "./model/product/product.service";
import { AuthController } from "./model/auth/auth.controller";
import { UserController } from "./model/user/user.controller";
import { ProductController } from "./model/product/product.controller";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./config/typeorm.config";
import { ConfigModule } from "@nestjs/config";

import helmet from "helmet";

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ProductModule],
  controllers: [AuthController, UserController, ProductController],
  providers: [AuthService, UserService, ProductService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, helmet()).forRoutes("*");
  }
}
