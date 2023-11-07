import { TypeOrmModule } from "@nestjs/typeorm";
import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
} from "@nestjs/common";
import { ProductImageEntity } from "./entities/product-image.entity";
import { ReviewImageEntity } from "./entities/review-image.entity";
import { ReviewVideoEntity } from "./entities/review-video.entity";
import { UserModule } from "../user/user.module";
import { ProductEntity } from "../product/entities/product.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { InquiryRequestImageEntity } from "./entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "./entities/inquiry-request-video.entity";
import { MediaVersionOneOnlyClientController } from "./controllers/media-v1-only-client.controller";
import { MediaVersionOneOnlyAdminController } from "./controllers/media-v1-only-admin.controller";
import { InquiryModule } from "../inquiry/inquiry.module";
import { InquiryResponseImageEntity } from "./entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "./entities/inquiry-response-video.entity";
import { mediaSelectProperty } from "src/common/config/repository-select-configs/media.select";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { productMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { MediaSearcher } from "./logic/media.searcher";
import { MediaSearchRepository } from "./repositories/media-search.repository";
import { productSelectProperty } from "../../common/config/repository-select-configs/product.select";
import { MediaValidator } from "./logic/media.validator";
import { MediaUtils } from "./logic/media.utils";
import { MediaUpdateRepository } from "./repositories/media-update.repository";
import { MediaUpdateService } from "./services/media-update.service";
import { eventMap } from "../../common/config/event-configs";
import { MediaEventMapSetter } from "./logic/media-event-map.setter";
import { MediaDeleteProductImageMiddleware } from "./middleware/media-delete-product-image.middleware";
import { MediaDeleteReviewImageMiddleware } from "./middleware/media-delete-review-image.middleware";
import { MediaDeleteInquiryRequestImageMiddleware } from "./middleware/media-delete-inquiry-request-image.middleware";
import { MediaDeleteInquiryRequestVideoMiddleware } from "./middleware/media-delete-inquiry-request-video.middleware";
import { MediaDeleteInquiryResponseImageMiddleware } from "./middleware/media-delete-inquiry-response-image.middleware";
import { MediaDeleteInquiryResponseVideoMiddleware } from "./middleware/media-delete-inquiry-response-video.middleware";
import { MediaDeleteReviewVideoMiddleware } from "./middleware/media-delete-review-video.middleware";
import { MediaFileEraser } from "./logic/media-file.eraser";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ReviewImageEntity,
      ReviewVideoEntity,
      InquiryRequestImageEntity,
      InquiryRequestVideoEntity,
      InquiryResponseImageEntity,
      InquiryResponseVideoEntity,
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => InquiryModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    MediaVersionOneOnlyClientController,
    MediaVersionOneOnlyAdminController,
  ],
  providers: [
    { provide: "ProductMediaCookieKey", useValue: productMediaCookieKey },
    { provide: "ReviewMediaCookieKey", useValue: reviewMediaCookieKey },
    { provide: "InquiryMediaCookieKey", useValue: inquiryMediaCookieKey },
    { provide: "MediaSelectProperty", useValue: mediaSelectProperty },
    { provide: "ProductsSelectProperty", useValue: productSelectProperty },
    { provide: "MediaEventMap", useValue: eventMap },
    MediaSearcher,
    MediaValidator,
    MediaUtils,
    MediaEventMapSetter,
    MediaDeleteProductImageMiddleware,
    MediaDeleteReviewImageMiddleware,
    MediaDeleteReviewImageMiddleware,
    MediaDeleteInquiryRequestImageMiddleware,
    MediaDeleteInquiryRequestVideoMiddleware,
    MediaDeleteInquiryResponseImageMiddleware,
    MediaDeleteInquiryResponseVideoMiddleware,
    MediaFileEraser,
    MediaUpdateService,
    MediaUpdateRepository,
    MediaSearchRepository,
  ],
  exports: [
    MediaSearcher,
    MediaDeleteProductImageMiddleware,
    MediaDeleteReviewImageMiddleware,
    MediaDeleteReviewImageMiddleware,
    MediaDeleteInquiryRequestImageMiddleware,
    MediaDeleteInquiryRequestVideoMiddleware,
    MediaDeleteInquiryResponseImageMiddleware,
    MediaDeleteInquiryResponseVideoMiddleware,
  ],
})
export class MediaModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(MediaDeleteProductImageMiddleware)
      .forRoutes("/api/v1/only-admin/media/product/image")
      .apply(MediaDeleteReviewImageMiddleware)
      .forRoutes("/api/v1/only-client/media/review/image")
      .apply(MediaDeleteReviewVideoMiddleware)
      .forRoutes("/api/v1/only-client/media/review/video")
      .apply(MediaDeleteInquiryRequestImageMiddleware)
      .forRoutes("/api/v1/only-client/media/inquiry/request/image")
      .apply(MediaDeleteInquiryRequestVideoMiddleware)
      .forRoutes("/api/v1/only-client/media/inquiry/request/video")
      .apply(MediaDeleteInquiryResponseImageMiddleware)
      .forRoutes("/api/v1/only-admin/media/inquiry/response/image")
      .apply(MediaDeleteInquiryResponseVideoMiddleware)
      .forRoutes("/api/v1/only-admin/media/inquiry/response/video");
  }
}
