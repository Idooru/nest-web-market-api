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
import { InquiryImageEntity } from "./entities/inquiry.image.entity";
import { InquiryVideoEntity } from "./entities/inquiry.video.entity";
import { MediaVersionOneOnlyClientController } from "./controllers/media-v1-only-client.controller";
import { MediaVersionOneOnlyAdminController } from "./controllers/media-v1-only-admin.controller";
import { MediaGeneralService } from "./services/media-general.service";
import { MediaGeneralRepository } from "./repositories/media-general.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ReviewImageEntity,
      ReviewVideoEntity,
      InquiryImageEntity,
      InquiryVideoEntity,
    ]),
    forwardRef(() => UserModule),
    JwtModule,
    LibraryModule,
    DotenvConfigurationModule,
  ],
  controllers: [
    MediaVersionOneOnlyClientController,
    MediaVersionOneOnlyAdminController,
  ],
  providers: [MediaGeneralService, MediaGeneralRepository],
  exports: [MediaGeneralService, MediaGeneralRepository],
})
export class MediaModule {}
