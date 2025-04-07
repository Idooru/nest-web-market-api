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
import { MediaValidator } from "./logic/media.validator";
import { MediaUtils } from "./logic/media.utils";
import { MediaUpdateRepository } from "./repositories/media-update.repository";
import { MediaService } from "./services/media.service";
import { deleteMediaEventMap } from "../../common/config/event-configs";
import { MediaEventMapSetter } from "./logic/media-event-map.setter";
import { MediaFileEraser } from "./logic/media-file.eraser";
import { ProductImageSearcher } from "./logic/product-image.searcher";
import { ProductImageSearchRepository } from "./repositories/product-image-search.repository";
import { InquiryResponseImageSearcher } from "./logic/inquiry-response-image.searcher";
import { InquiryResponseImageSearchRepository } from "./repositories/inquiry-response-image-search.repository";
import { InquiryResponseVideoSearchRepository } from "./repositories/inquiry-response-video-search.repository";
import { InquiryResponseVideoSearcher } from "./logic/inquiry-response-video.searcher";
import { ReviewImageSearcher } from "./logic/review-image.searcher";
import { ReviewImageSearchRepository } from "./repositories/review-image-search.repository";
import { ReviewVideoSearcher } from "./logic/review-video.searcher";
import { ReviewVideoSearchRepository } from "./repositories/review-video-search.repository";
import { InquiryRequestImageSearcher } from "./logic/inquiry-request-image.searcher";
import { InquiryRequestImageSearchRepository } from "./repositories/inquiry-request-image-search.repository";
import { InquiryRequestVideoSearchRepository } from "./repositories/inquiry-request-video-search.repository";
import { InquiryRequestVideoSearcher } from "./logic/inquiry-request-video.searcher";

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
    ProductImageSearcher,
    ProductImageSearchRepository,
    ReviewImageSearcher,
    ReviewImageSearchRepository,
    ReviewVideoSearcher,
    ReviewVideoSearchRepository,
    InquiryRequestImageSearcher,
    InquiryRequestImageSearchRepository,
    InquiryRequestVideoSearcher,
    InquiryRequestVideoSearchRepository,
    InquiryResponseImageSearcher,
    InquiryResponseImageSearchRepository,
    InquiryResponseVideoSearcher,
    InquiryResponseVideoSearchRepository,
    MediaValidator,
    MediaUtils,
    MediaEventMapSetter,
    MediaFileEraser,
    MediaService,
    MediaUpdateRepository,
  ],
  exports: [
    { provide: "delete-media-event-map", useValue: deleteMediaEventMap },
    ProductImageSearcher,
    ReviewImageSearcher,
    ReviewVideoSearcher,
    InquiryRequestImageSearcher,
    InquiryRequestVideoSearcher,
    InquiryResponseImageSearcher,
    InquiryResponseVideoSearcher,
    MediaEventMapSetter,
    MediaUtils,
    MediaUpdateRepository,
  ],
})
export class MediaModule {}
