import { Injectable } from "@nestjs/common";
import { ProductEntity } from "../entities/product.entity";
import { ProductBasicRawDto } from "../dto/response/product-basic-raw.dto";
import { ProductDetailRawDto } from "../dto/response/product-detail-raw.dto";
import { ProductSearchRepository } from "../repositories/product-search.repository";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllProductsDto } from "../dto/request/find-all-products.dto";

@Injectable()
export class ProductSearcher implements Searcher<ProductEntity, FindAllProductsDto, ProductBasicRawDto> {
  constructor(private readonly productSearchRepository: ProductSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<ProductEntity | ProductEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.productSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.productSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public findAllRaws(dto: FindAllProductsDto): Promise<ProductBasicRawDto[]> {
    return this.productSearchRepository.findAllRaws(dto);
  }

  public findDetailRaw(id: string): Promise<ProductDetailRawDto> {
    return this.productSearchRepository.findDetailRaw(id);
  }
}
