import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./providers/product.repository";
import { ProductEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductController } from "../product/controllers/product.controller";
import { ProductService } from "./providers/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppConfigModule } from "src/common/config/app.config.module";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductImageEntity } from "../upload/entities/product.image.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => UploadModule),
    forwardRef(() => AppConfigModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => InquiryModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
