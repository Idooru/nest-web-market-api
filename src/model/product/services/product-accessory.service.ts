import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductImageEntity } from "src/model/media/entities/product.image.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { ProductEntity } from "../entities/product.entity";
import { ProductGeneralRepository } from "../repositories/product-general.repository";
import { MediaDto } from "src/model/media/dto/media.dto";

@Injectable()
export class ProductAccessoryService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
  ) {}

  isExistProducts(founds: ProductEntity[]): void {
    if (!founds.length) {
      throw new NotFoundException("데이터베이스에 상품이 존재하지 않습니다.");
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
