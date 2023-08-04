import { HttpStatus, Injectable } from "@nestjs/common";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { MediaDto } from "src/model/media/dto/media.dto";
import { IProductAccessoryService } from "../interfaces/services/product-accessory-service.interface";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { StarRateGeneralRepository } from "src/model/review/repositories/star-rate-general.repository";
import { StarRateInsertRepository } from "src/model/review/repositories/star-rate-insert.repository";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { PushProductImageDto } from "../dto/push-product-image.dto";
import { ProductDto } from "../dto/product.dto";
import { InsertProductImageDto } from "../dto/insert-product-image.dto";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { ProductEntity } from "src/model/product/entities/product.entity";

@Injectable()
export class ProductAccessoryService
  extends ErrorHandlerProps
  implements IProductAccessoryService
{
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
    private readonly starRateInsertRepository: StarRateInsertRepository,
  ) {
    super();
  }

  isExistProducts(founds: ProductEntity[]): void {
    if (!founds.length) {
      this.methodName = this.isExistProducts.name;
      this.httpExceptionHandlingBuilder
        .setMessage("데이터베이스에 상품이 존재하지 않습니다.")
        .setOccuredLocation("class")
        .setOccuredClass(this.className, this.methodName)
        .setExceptionStatus(HttpStatus.NOT_FOUND)
        .handle();
    }
  }

  async createStarRate(product: ProductEntity): Promise<void> {
    await this.starRateGeneralRepository.createStarRate(product);
  }

  async insertProductIdOnStarRate(
    starRate: StarRateEntity,
    product: ProductEntity,
  ): Promise<void> {
    await this.starRateInsertRepository.insertProductIdOnStarRate(
      starRate,
      product,
    );
  }

  async pushMoreThenTwoProductImageInDto(
    productImgCookies: MediaDto[],
    productDto: ProductDto,
  ): Promise<void> {
    const promises = productImgCookies.map(async (productImgCookie) => {
      const image = await this.mediaGeneralRepository.findProductImageWithUrl(
        productImgCookie.url,
      );

      productDto.Image.push(image);
    });

    await Promise.all(promises);
  }

  async pushOneProductImageInDto(
    productImgCookies: MediaDto[],
    productDto: ProductDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findProductImageWithUrl(
      productImgCookies[0].url,
    );

    productDto.Image.push(image);
  }

  async pushProductImages(
    pushProductImageDto: PushProductImageDto,
  ): Promise<void> {
    const { productImgCookies, productDto } = pushProductImageDto;

    productDto.Image = [];

    if (productImgCookies.length >= 2) {
      await this.pushMoreThenTwoProductImageInDto(
        productImgCookies,
        productDto,
      );
    } else {
      await this.pushOneProductImageInDto(productImgCookies, productDto);
    }
  }

  async insertProductIdOneMoreThenTwoProductImage(
    productImages: ProductImageEntity[],
    product: ProductEntity,
  ): Promise<void> {
    const promises = productImages.map(async (productImage) => {
      await this.mediaInsertRepository.insertProductIdOnProductImage(
        productImage,
        product,
      );
    });

    await Promise.all(promises);
  }

  async insertProductIdOnOneProductImage(
    productImage: ProductImageEntity,
    product: ProductEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertProductIdOnProductImage(
      productImage,
      product,
    );
  }

  async insertProductImages(
    insertProductImageDto: InsertProductImageDto,
  ): Promise<void> {
    const { productImgCookies, productDto, product } = insertProductImageDto;

    if (productImgCookies.length >= 2) {
      await this.insertProductIdOneMoreThenTwoProductImage(
        productDto.Image,
        product,
      );
    } else {
      await this.insertProductIdOnOneProductImage(productDto.Image[0], product);
    }
  }

  async findProductAndImageForModify(
    id: string,
    imageCookie: MediaDto,
  ): Promise<[ProductEntity, ProductImageEntity, ProductImageEntity]> {
    return await Promise.all([
      this.productGeneralRepository.findOneProductById(id),
      this.mediaGeneralRepository.findProductImageWithUrl(imageCookie.url),
      this.mediaGeneralRepository.findProductImageEvenUseWithId(id),
    ]);
  }
}
