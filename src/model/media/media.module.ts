import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { ProductImageEntity } from "./entities/product-image.entity";
import { ReviewImageEntity } from "./entities/review-image.entity";
import { ReviewVideoEntity } from "./entities/review-video.entity";
import { UserModule } from "../user/user.module";
import { ProductEntity } from "../product/entities/product.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { InquiryRequestImageEntity } from "./entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "./entities/inquiry-request-video.entity";
import { MediaV1ClientController } from "./controllers/media-v1-client.controller";
import { MediaV1AdminController } from "./controllers/media-v1-admin.controller";
import { InquiryModule } from "../inquiry/inquiry.module";
import { InquiryResponseImageEntity } from "./entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "./entities/inquiry-response-video.entity";
import { mediaSelect } from "src/common/config/repository-select-configs/media.select";
import { reviewMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import { inquiryMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { productMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { MediaSearcher } from "./logic/media.searcher";
import { MediaSearchRepository } from "./repositories/media-search.repository";
import { MediaValidator } from "./logic/media.validator";
import { MediaUtils } from "./logic/media.utils";
import { MediaUpdateRepository } from "./repositories/media-update.repository";
import { MediaService } from "./services/media.service";
import { deleteMediaEventMap } from "../../common/config/event-configs";
import { MediaEventMapSetter } from "./logic/media-event-map.setter";
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
    LibraryModule,
  ],
  controllers: [MediaV1ClientController, MediaV1AdminController],
  providers: [
    { provide: "product-media-cookie-key", useValue: productMediaCookieKey },
    { provide: "review-media-cookie-key", useValue: reviewMediaCookieKey },
    { provide: "inquiry-media-cookie-key", useValue: inquiryMediaCookieKey },
    { provide: "delete-media-event-map", useValue: deleteMediaEventMap },
    { provide: "media-select", useValue: mediaSelect },
    MediaSearcher,
    MediaValidator,
    MediaUtils,
    MediaEventMapSetter,
    MediaFileEraser,
    MediaService,
    MediaUpdateRepository,
    MediaSearchRepository,
  ],
  exports: [
    { provide: "delete-media-event-map", useValue: deleteMediaEventMap },
    MediaSearcher,
    MediaEventMapSetter,
    MediaUtils,
  ],
})
export class MediaModule {}

// export class MediaModule implements NestModule {
//   public configure(consumer: MiddlewareConsumer): void {
//     consumer
//       .apply(DeleteProductMediaMiddleware)
//       .forRoutes({
//         path: "*/media/product/*",
//         method: RequestMethod.DELETE,
//       })
//       .apply(DeleteReviewMediaMiddleware)
//       .forRoutes({ path: "*/media/review/*", method: RequestMethod.DELETE })
//       .apply(DeleteInquiryRequestMediaMiddleware)
//       .forRoutes({
//         path: "*/media/inquiry/request/*",
//         method: RequestMethod.DELETE,
//       })
//       .apply(DeleteInquiryResponseMediaMiddleware)
//       .forRoutes({
//         path: "*/media/inquiry/response/*",
//         method: RequestMethod.DELETE,
//       });
//   }
// }
