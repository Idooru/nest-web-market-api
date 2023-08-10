import { Injectable } from "@nestjs/common";
import { ProductAccessoryService } from "./product-accessory.service";
import { ProductEntity } from "../entities/product.entity";
import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductGeneralService } from "./product-general.service";

@Injectable()
export class ProductFunctionService {
  constructor(
    private readonly productGeneralService: ProductGeneralService,
    private readonly productAccessoryService: ProductAccessoryService,
  ) {}

  async getCreateStarRate(product: ProductEntity): Promise<() => void> {
    return async () => {
      await this.productAccessoryService.createStarRate(product);
    };
  }

  async getInsertProductImage(
    productImgCookies: MediaDto[],
    product: ProductEntity,
  ): Promise<() => void> {
    return async () => {
      const productImages = await this.productAccessoryService.getProductImages(
        productImgCookies,
      );

      await this.productAccessoryService.insertProductImages(
        productImages,
        product,
      );
    };
  }

  async getModifyProductImage(
    id: string,
    productImgCookies: MediaDto[],
  ): Promise<() => void> {
    return async () => {
      const product = await this.productGeneralService.findProductById(id);

      const productImages = await this.productAccessoryService.getProductImages(
        productImgCookies,
      );

      await this.productAccessoryService.modifyProductImages(
        product,
        productImages,
      );
    };
  }
}
