import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { ProductImageEntity } from "./entities/product.image.entity";
import { ReviewImageEntity } from "./entities/review.image.entity";
import { ReviewVideoEntity } from "./entities/review.video.entity";
import { UserModule } from "../user/user.module";
import { ProductEntity } from "../product/entities/product.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { DotenvConfigurationModule } from "src/common/config/dotenv.config";
import { InquiryRequestImageEntity } from "./entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "./entities/inquiry-request-video.entity";
import { MediaVersionOneOnlyClientController } from "./controllers/media-v1-only-client.controller";
import { MediaVersionOneOnlyAdminController } from "./controllers/media-v1-only-admin.controller";
import { MediaGeneralService } from "./services/media-general.service";
import { MediaGeneralRepository } from "./repositories/media-general.repository";
import { MediaInsertRepository } from "./repositories/media-insert.repository";
import { MediaAccessoryService } from "./services/media-accessory.service";
import { MediaBundleService } from "./services/media-bundle.service";
import { InquiryModule } from "../inquiry/inquiry.module";
import { InquiryResponseImageEntity } from "./entities/inquiry-response-image.entity";
import { InquiryResponseVideoEntity } from "./entities/inquiry-response-video.entity";
import { MulterConfigurationModule } from "src/common/config/multer.config";

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
    DotenvConfigurationModule,
    MulterConfigurationModule,
  ],
  controllers: [
    MediaVersionOneOnlyClientController,
    MediaVersionOneOnlyAdminController,
  ],
  providers: [
    MediaGeneralService,
    MediaAccessoryService,
    MediaBundleService,
    MediaGeneralRepository,
    MediaInsertRepository,
  ],
  exports: [
    MediaGeneralService,
    MediaAccessoryService,
    MediaBundleService,
    MediaGeneralRepository,
    MediaInsertRepository,
  ],
})
export class MediaModule {}
