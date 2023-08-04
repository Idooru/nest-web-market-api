import { MediaDto } from "src/model/media/dto/media.dto";
import { ProductEntity } from "../../entities/product.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ProductDto } from "../../dto/product.dto";
import { PushProductImageDto } from "../../dto/push-product-image.dto";
import { InsertProductImageDto } from "../../dto/insert-product-image.dto";

export interface IProductAccessoryService {
  isExistProducts(founds: ProductEntity[]): void;
  createStarRate(product: ProductEntity): Promise<void>;
  insertProductIdOnStarRate(
    starRate: StarRateEntity,
    product: ProductEntity,
  ): Promise<void>;
  pushMoreThenTwoProductImageInDto(
    productImgCookies: MediaDto[],
    productDto: ProductDto,
  ): Promise<void>;
  pushOneProductImageInDto(
    productImgCookies: MediaDto[],
    productDto: ProductDto,
  ): Promise<void>;
  pushProductImages(pushProductImageDto: PushProductImageDto): Promise<void>;
  insertProductIdOneMoreThenTwoProductImage(
    productImages: ProductImageEntity[],
    product: ProductEntity,
  ): Promise<void>;
  insertProductIdOnOneProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void>;
  insertProductImages(
    insertProductImageDto: InsertProductImageDto,
  ): Promise<void>;
  findProductAndImageForModify(
    id: string,
    imageCookie: MediaDto,
  ): Promise<[ProductEntity, ProductImageEntity, ProductImageEntity]>;
}
