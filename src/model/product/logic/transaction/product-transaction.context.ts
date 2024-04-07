import { Injectable } from "@nestjs/common";
import { SearchCreateProductDto } from "../../dto/search-create-product.dto";
import { ProductUpdateService } from "../../services/product-update.service";
import { ProductFactoryService } from "../../services/product-factory.service";
import { SearchModifyProductDto } from "../../dto/search-modify-product.dto";
import { SearchModifyProductImageDto } from "../../dto/search-modify-product-image.dto";

@Injectable()
export class ProductTransactionContext {
  constructor(
    private readonly productUpdateService: ProductUpdateService,
    private readonly productFactoryService: ProductFactoryService,
  ) {}

  public createProductContext(dto: SearchCreateProductDto): () => Promise<void> {
    const { productBodyDto, productImages, admin } = dto;

    return async () => {
      const product = await this.productUpdateService.createProduct({
        productBodyDto,
        admin,
      });

      const createStarRate = this.productFactoryService.getCreateStarRateFunc(product);

      const insertProductImage = this.productFactoryService.getInsertProductImageFunc({
        productImages,
        product,
      });

      await Promise.all([createStarRate(), insertProductImage()]);
    };
  }

  public modifyProductContext(dto: SearchModifyProductDto): () => Promise<void> {
    const { product, productBodyDto, beforeProductImages, newProductImages } = dto;

    return async () => {
      await this.productUpdateService.modifyProduct({
        productBodyDto,
        product,
      });

      const modifyProductImage = this.productFactoryService.getModifyProductImageFunc({
        beforeProductImages,
        newProductImages,
        product,
      });

      await modifyProductImage();
    };
  }

  public modifyProductImageContext(dto: SearchModifyProductImageDto): () => Promise<void> {
    const { product, beforeProductImages, newProductImages } = dto;

    return async () => {
      const modifyProductImage = this.productFactoryService.getModifyProductImageFunc({
        beforeProductImages,
        newProductImages,
        product,
      });

      await modifyProductImage();
    };
  }
}
