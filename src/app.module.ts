import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./model/auth/auth.module";
import { UserModule } from "./model/user/user.module";
import { ProductModule } from "./model/product/product.module";
import { LoggerMiddleware } from "./lib/middlewares/logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./lib/config/typeorm.config";
import { ConfigModule } from "@nestjs/config";

import helmet from "helmet";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    AuthModule,
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, helmet()).forRoutes("*");
  }
}
