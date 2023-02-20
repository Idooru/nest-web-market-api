import { TypeOrmModule } from "@nestjs/typeorm";
import { Module, forwardRef } from "@nestjs/common";
import { UploadGeneralService } from "./services/upload-general.service";
import { UploadVersionOneFreeUseController } from "./controllers/upload-v1-free-use.controller";
import { ProductImageEntity } from "./entities/product.image.entity";
import { ReviewImageEntity } from "./entities/review.image.entity";
import { ReviewVideoEntity } from "./entities/review.video.entity";
import { UploadGeneralRepository } from "./repositories/upload-general.repository";
import { UserModule } from "../user/user.module";
import { InquiryImageEntity } from "../inquiry/entities/inquiry.image.entity";
import { InquiryVideoEntity } from "../inquiry/entities/inquiry.video.entity";
import { ProductEntity } from "../product/entities/product.entity";
import { MulterConfig } from "src/common/config/multer.config";
import { LibraryModule } from "src/common/lib/library.module";
import { JwtModule } from "@nestjs/jwt";
import { UploadVersionOneOnlyAdminController } from "./controllers/upload-v1-only-admin.controller";
import { DotenvConfigurationModule } from "src/common/config/dotenv.config";

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
    UploadVersionOneFreeUseController,
    UploadVersionOneOnlyAdminController,
  ],
  providers: [UploadGeneralService, UploadGeneralRepository, MulterConfig],
  exports: [UploadGeneralService, UploadGeneralRepository],
})
export class UploadModule {}
