import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./model/auth/auth.module";
import { UserModule } from "./model/user/user.module";
import { ProductModule } from "./model/product/product.module";
import { ResponseLoggerMiddleware } from "./common/middlewares/response.logger.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EtcConfig } from "./common/config/etc.config";
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from "./model/upload/upload.module";
import { ReviewModule } from "./model/review/review.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(new EtcConfig().typeOrmConfig),
    AuthModule,
    UserModule,
    ProductModule,
    UploadModule,
    ReviewModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseLoggerMiddleware).forRoutes("*");
  }
}
