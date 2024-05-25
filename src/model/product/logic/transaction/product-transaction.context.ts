import { Injectable } from "@nestjs/common";
import { SearchCreateProductDto } from "../../dto/search-create-product.dto";
import { ProductService } from "../../services/product.service";
import { SearchModifyProductDto } from "../../dto/search-modify-product.dto";
import { SearchModifyProductImageDto } from "../../dto/search-modify-product-image.dto";

@Injectable()
export class ProductTransactionContext {
  constructor(private readonly productService: ProductService) {}

  public createProductContext(dto: SearchCreateProductDto): () => Promise<void> {
    const { productBodyDto, productImages, admin } = dto;

    return async () => {
      const product = await this.productService.createProduct({
        productBodyDto,
        admin,
      });

      const starRateWork = async () => {
        await this.productService.createStarRate(product);
      };

      const imageWork = async () => {
        await this.productService.insertProductImages({
          productImages,
          product,
        });
      };

      await Promise.all([starRateWork(), imageWork()]);
    };
  }

  public modifyProductContext(dto: SearchModifyProductDto): () => Promise<void> {
    const { product, productBodyDto, beforeProductImages, newProductImages } = dto;

    return async () => {
      await this.productService.modifyProduct({
        productBodyDto,
        product,
      });

      const imageWork = async () => {
        await this.productService.changeProductImages({
          beforeProductImages,
          newProductImages,
          product,
        });
      };

      await imageWork();
    };
  }

  public modifyProductImageContext(dto: SearchModifyProductImageDto): () => Promise<void> {
    const { product, beforeProductImages, newProductImages } = dto;

    return async () => {
      const imageWork = async () => {
        await this.productService.changeProductImages({
          beforeProductImages,
          newProductImages,
          product,
        });
      };

      await imageWork();
    };
  }
}
