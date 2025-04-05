import { Injectable } from "@nestjs/common";
import { SearchCreateProductDto } from "../../dto/request/search-create-product.dto";
import { ProductService } from "../../services/product.service";
import { SearchModifyProductDto } from "../../dto/request/search-modify-product.dto";
import { SearchModifyProductImageDto } from "../../dto/request/search-modify-product-image.dto";
import { ModifyProductDto } from "../../dto/request/modify-product.dto";
import { ChangeProductImageDto } from "../../dto/request/change-product-image.dto";
import { InsertProductImagesDto } from "../../dto/request/insert-product-image.dto";
import { CreateProductDto } from "../../dto/request/create-product.dto";

@Injectable()
export class ProductTransactionContext {
  constructor(private readonly productService: ProductService) {}

  public async createProductContext(dto: SearchCreateProductDto): Promise<void> {
    const { body, productImages, admin } = dto;

    const createProductDto: CreateProductDto = {
      body,
      admin,
    };

    const product = await this.productService.createProduct(createProductDto);

    const insertProductImagesDto: InsertProductImagesDto = {
      productId: product.id,
      productImages,
    };

    await Promise.all([
      this.productService.createStarRate(product),
      this.productService.insertProductImages(insertProductImagesDto),
    ]);
  }

  public async modifyProductContext(dto: SearchModifyProductDto): Promise<void> {
    const { productId, body, beforeProductImages, newProductImages } = dto;

    const modifyProductDto: ModifyProductDto = {
      productId,
      body,
    };

    const changeProductImageDto: ChangeProductImageDto = {
      productId,
      beforeProductImages,
      newProductImages,
    };

    const promises = [this.productService.modifyProduct(modifyProductDto)];
    if (dto.beforeProductImages && dto.newProductImages) {
      promises.push(this.productService.changeProductImages(changeProductImageDto));
    }

    await Promise.all(promises);
  }

  public async modifyProductImageContext(dto: SearchModifyProductImageDto): Promise<void> {
    await this.productService.changeProductImages(dto);
  }
}
