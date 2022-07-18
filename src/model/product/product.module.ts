import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./providers/product.repository";
import { ProductsEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductController } from "../product/controllers/product.controller";
import { ProductService } from "./providers/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EtcModule } from "../../common/config/etc/etc.module";
import { UserModule } from "../user/user.module";
import { ReviewModule } from "../review/review.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductsEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => UploadModule),
    forwardRef(() => EtcModule),
    forwardRef(() => ReviewModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
