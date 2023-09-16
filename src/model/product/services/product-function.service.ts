import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";
import { ProductOperationService } from "./product-operation.service";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { ModifyProductImageDto } from "../dto/modify-product-image.dto";

@Injectable()
export class ProductFunctionService {
  constructor(
    private readonly productOperationService: ProductOperationService,
  ) {}

  async getCreateStarRateFunc(product: ProductEntity): Promise<() => void> {
    return async () => {
      await this.productOperationService.createStarRate(product);
    };
  }

  async getInsertProductImageFunc(
    insertProductImageDto: InsertProductImageDto,
  ): Promise<() => void> {
    return async () => {
      await this.productOperationService.insertProductImages(
        insertProductImageDto,
      );
    };
  }

  async getModifyProductImageFunc(
    modifyProductImageDto: ModifyProductImageDto,
  ): Promise<() => void> {
    return async () => {
      await this.productOperationService.modifyProductImages(
        modifyProductImageDto,
      );
    };
  }
}
