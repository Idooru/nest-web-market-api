import { MediaModule } from "./../media/media.module";
import { ProductGeneralRepository } from "./repositories/product-general.repository";
import { ProductEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductVersionOneFreeUseController } from "./controllers/v1/product-v1-free-use.controller";
import { ProductGeneralService } from "./services/product-general.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductImageEntity } from "../media/entities/product-image.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { ProductVersionOneOnlyAdminController } from "./controllers/v1/product-v1-only-admin.controller";
import { JwtModule } from "@nestjs/jwt";
import { ProductVersionOneVerfiyController } from "./controllers/v1/product-v1-verify.controller";
import { ProductVerifyService } from "./services/product-verify.service";
import { ProductVerifyRepository } from "./repositories/product-verify.repository";
import { ProductInsertRepository } from "./repositories/product-insert.repository";
import { ProductAccessoryService } from "./services/product-accessory.service";
import { productSelectProperty } from "src/common/config/repository-select-configs/product.select";
import { productMediaCookieKey } from "src/common/config/cookie-key-configs/media-cookie-keys/product-media-cookie.key";
import { productVerifyCookieKey } from "src/common/config/cookie-key-configs/verify-cookie-keys/product-verify-cookie.key";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => MediaModule),
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
    {
      provide: "ProductVerifyCookieKey",
      useValue: productVerifyCookieKey,
    },
    {
      provide: "ProductMediaCookieKey",
      useValue: productMediaCookieKey,
    },
    {
      provide: "ProductsSelectProperty",
      useValue: productSelectProperty,
    },
    ProductGeneralService,
    ProductVerifyService,
    ProductAccessoryService,
    ProductGeneralRepository,
    ProductVerifyRepository,
    ProductInsertRepository,
  ],
  exports: [
    ProductGeneralService,
    ProductVerifyService,
    ProductAccessoryService,
    ProductGeneralRepository,
    ProductVerifyRepository,
    ProductInsertRepository,
  ],
})
export class ProductModule {}
