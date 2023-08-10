import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";

export interface IProductAccessoryService {
  isExistProducts(founds: ProductEntity[]): void;
  createStarRate(product: ProductEntity): Promise<void>;
  getProductImages(
    productImgCookies: MediaDto[],
  ): Promise<ProductImageEntity[]>;
  insertProductImages(
    productImages: ProductImageEntity[],
    product: ProductEntity,
  ): Promise<void>;
  modifyProductImages(
    product: ProductEntity,
    productImages: ProductImageEntity[],
  ): Promise<void>;
}
