import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Injectable } from "@nestjs/common";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { ProductImageSearchRepository } from "../repositories/product-image-search.repository";
import { ProductImageEntity } from "../entities/product-image.entity";
import { MediaBasicRawDto } from "../dto/response/media-basic-raw.dto";
import { MediaCookieDto } from "../dto/request/media-cookie.dto";

@Injectable()
export class ProductImageSearcher implements Searcher<ProductImageEntity, MediaCookieDto, MediaBasicRawDto> {
  constructor(private readonly productImageSearchRepository: ProductImageSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<ProductImageEntity | ProductImageEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.productImageSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.productImageSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public async findAllRaws(dto: MediaCookieDto[]): Promise<MediaBasicRawDto[]> {
    return this.productImageSearchRepository.findAllRaws(dto);
  }
}
