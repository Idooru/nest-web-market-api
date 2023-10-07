import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";
import { ProductUpdateService } from "./product-update.service";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { ChangeProductImageDto } from "../dto/change-product-image.dto";

@Injectable()
export class ProductFactoryService {
  constructor(private readonly productOperationService: ProductUpdateService) {}

  getCreateStarRateFunc(product: ProductEntity): () => void {
    return async () => {
      await this.productOperationService.createStarRate(product);
    };
  }

  getInsertProductImageFunc(
    insertProductImageDto: InsertProductImageDto,
  ): () => void {
    return async () => {
      await this.productOperationService.insertProductImages(
        insertProductImageDto,
      );
    };
  }

  getModifyProductImageFunc(
    modifyProductImageDto: ChangeProductImageDto,
  ): () => void {
    return async () => {
      await this.productOperationService.changeProductImages(
        modifyProductImageDto,
      );
    };
  }
}
