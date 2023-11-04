import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";
import { ProductUpdateService } from "./product-update.service";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { ChangeProductImageDto } from "../dto/change-product-image.dto";

@Injectable()
export class ProductFactoryService {
  constructor(private readonly productOperationService: ProductUpdateService) {}

  public getCreateStarRateFunc(product: ProductEntity): () => Promise<void> {
    return async () => {
      await this.productOperationService.createStarRate(product);
    };
  }

  public getInsertProductImageFunc(
    insertProductImageDto: InsertProductImageDto,
  ): () => Promise<void> {
    return async () => {
      await this.productOperationService.insertProductImages(
        insertProductImageDto,
      );
    };
  }

  public getModifyProductImageFunc(
    modifyProductImageDto: ChangeProductImageDto,
  ): () => Promise<void> {
    return async () => {
      await this.productOperationService.changeProductImages(
        modifyProductImageDto,
      );
    };
  }
}
