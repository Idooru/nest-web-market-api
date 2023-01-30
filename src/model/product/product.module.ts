import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./providers/product.repository";
import { ProductEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductVersionOneFreeUseController } from "./controllers/product-v1-free-use.controller";
import { ProductService } from "./providers/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductImageEntity } from "../upload/entities/product.image.entity";
import { LibraryModule } from "src/common/lib/library.module";
import { ProductVersionOneOnlyAdminController } from "./controllers/product-v1-only-admin.controller";
import { JwtModule } from "@nestjs/jwt";

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
  ],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
