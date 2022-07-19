import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./providers/product.repository";
import { ProductsEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductController } from "../product/controllers/product.controller";
import { ProductService } from "./providers/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FunctionModule } from "../../common/config/etc/function.module";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";
import { InquiryModule } from "../inquiry/inquiry.module";
import { ProductsImageEntity } from "../upload/entities/product.image.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsEntity, ProductsImageEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => UploadModule),
    forwardRef(() => FunctionModule),
    forwardRef(() => ReviewModule),
    forwardRef(() => InquiryModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
