import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { AuthModule } from "./model/auth/auth.module";
import { UserModule } from "./model/user/user.module";
import { ProductModule } from "./model/product/product.module";
import { ResponseLoggerMiddleware } from "./common/middlewares/response-logger.middleware";
import { ReviewModule } from "./model/review/review.module";
import { DotenvConfigurationModule } from "./common/config/dotenv.config";
import { TypeormConfigurationModule } from "./common/config/typeorm.config";
import { MediaModule } from "./model/media/media.module";
import { MulterConfigurationModule } from "./common/config/multer.config";
import { AppController } from "./app.controller";
import { LibraryModule } from "./common/lib/library.module";

@Module({
  imports: [
    DotenvConfigurationModule,
    TypeormConfigurationModule,
    MulterConfigurationModule,
    AuthModule,
    UserModule,
    ProductModule,
    MediaModule,
    ReviewModule,
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
