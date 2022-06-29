import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./product.repository";
import { ProductEntity } from "./product.entity";
import { Module } from "@nestjs/common";
import { ProductController } from "../product/controllers/product.controller";
import { ProductService } from "../product/services/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EtcModule } from "../etc/etc.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    UserModule,
    UploadModule,
    EtcModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
