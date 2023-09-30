import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";
import { ProductOperationService } from "./product-operation.service";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { ChangeProductImageDto } from "../dto/modify-product-image.dto";

@Injectable()
export class ProductFunctionService {
  constructor(
    private readonly productOperationService: ProductOperationService,
  ) {}

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
