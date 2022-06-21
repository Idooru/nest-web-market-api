import { UploadModule } from "./../upload/upload.module";
import { ProductRepository } from "./product.repository";
import { ProductEntity } from "./product.entity";
import { Module } from "@nestjs/common";
import { ProductController } from "../product/controllers/product.controller";
import { ProductService } from "../product/services/product.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), UploadModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
