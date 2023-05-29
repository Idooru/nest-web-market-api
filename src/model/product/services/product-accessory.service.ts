import { HttpStatus, Injectable } from "@nestjs/common";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { ProductEntity } from "../entities/product.entity";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { MediaDto } from "src/model/media/dto/media.dto";
import { IProductAccessoryService } from "../interfaces/services/product-accessory-service.interface";
import { HttpExceptionHandlingBuilder } from "src/common/lib/error-handler/http-exception-handling.builder";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";

@Injectable()
export class ProductAccessoryService
  extends ErrorHandlerProps
  implements IProductAccessoryService
{
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly httpExceptionHandlingBuilder: HttpExceptionHandlingBuilder,
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
