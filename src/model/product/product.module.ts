import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./providers/product.repository";
import { ProductEntity } from "../product/entities/product.entity";
import { Module, forwardRef } from "@nestjs/common";
import { ProductController } from "../product/controllers/product.controller";
import { ProductService } from "./providers/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EtcModule } from "../etc/etc.module";
import { UserModule } from "../user/user.module";
import { RatingEntity } from "./entities/rating.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, RatingEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => UploadModule),
    forwardRef(() => EtcModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
