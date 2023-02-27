import { UploadModule } from "./../upload/upload.module";
import { ProductGeneralRepository } from "./repositories/product-general.repository";
import { ProductEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductVersionOneFreeUseController } from "./controllers/v1/product-v1-free-use.controller";
import { ProductGeneralService } from "./services/product-general.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductImageEntity } from "../upload/entities/product.image.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { ProductVersionOneOnlyAdminController } from "./controllers/v1/product-v1-only-admin.controller";
import { JwtModule } from "@nestjs/jwt";
import { ProductVersionOneVerfiyController } from "./controllers/v1/product-v1-verify.controller";
import { ProductVerifyService } from "./services/product-verify.service";
import { ProductVerifyRepository } from "./repositories/product-verify.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => UploadModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => InquiryModule),
    JwtModule,
    LibraryModule,
  ],
  controllers: [
    ProductVersionOneFreeUseController,
    ProductVersionOneOnlyAdminController,
    ProductVersionOneVerfiyController,
  ],
  providers: [
    ProductGeneralService,
    ProductGeneralRepository,
    ProductVerifyService,
    ProductVerifyRepository,
  ],
  exports: [
    ProductGeneralService,
    ProductGeneralRepository,
    ProductVerifyService,
    ProductVerifyRepository,
  ],
})
export class ProductModule {}
