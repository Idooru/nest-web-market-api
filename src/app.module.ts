import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./model/auth/auth.module";
import { UserModule } from "./model/user/user.module";
import { ProductModule } from "./model/product/product.module";
import { ResponseLoggerMiddleware } from "./common/middlewares/response-logger.middleware";
import { ReviewModule } from "./model/review/review.module";
import { MediaModule } from "./model/media/media.module";
import { AppController } from "./app.controller";
import { LibraryModule } from "./common/lib/library.module";
import { InquiryModule } from "./model/inquiry/inquiry.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    MediaModule,
    ReviewModule,
    InquiryModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseLoggerMiddleware).forRoutes("*");
  }
}
