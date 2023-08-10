import { HttpStatus, Injectable } from "@nestjs/common";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaDto } from "src/model/media/dto/media.dto";
import { IProductAccessoryService } from "../interfaces/services/product-accessory-service.interface";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { StarRateGeneralRepository } from "src/model/review/repositories/star-rate-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { ProductEntity } from "src/model/product/entities/product.entity";

@Injectable()
export class ProductAccessoryService
  extends ErrorHandlerProps
  implements IProductAccessoryService
{
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
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

  async getProductImages(
    productImgCookies: MediaDto[],
  ): Promise<ProductImageEntity[]> {
    const productImages = productImgCookies.map(async (productImgCookie) => {
      return await this.mediaGeneralRepository.findProductImageWithUrl(
        productImgCookie.url,
      );
    });

    return await Promise.all(productImages);
  }

  async insertProductImages(
    productImages: ProductImageEntity[],
    product: ProductEntity,
  ): Promise<void> {
    const insertWork = productImages.map(async (productImage) => {
      await this.mediaInsertRepository.insertProductIdOnProductImage(
        productImage,
        product,
      );
    });

    await Promise.all(insertWork);
  }

  async modifyProductImages(
    product: ProductEntity,
    productImages: ProductImageEntity[],
  ): Promise<void> {
    const beforeProductImages =
      await this.mediaGeneralRepository.findBeforeProductImagesWithId(
        product.id,
      );

    const modifyWork = productImages.map(async (productImage) => {
      await this.mediaInsertRepository.insertProductIdOnProductImage(
        productImage,
        product,
      );
    });

    await Promise.all(modifyWork);

    if (beforeProductImages.length >= 1) {
      const deleteWork = beforeProductImages.map(async (beforeProductImage) => {
        await this.mediaGeneralRepository.deleteProductImageWithId(
          beforeProductImage.id,
        );
      });

      await Promise.all(deleteWork);
    }
  }
}
