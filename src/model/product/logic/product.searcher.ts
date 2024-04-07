import { Injectable } from "@nestjs/common";
import { ProductSearchRepository } from "../repositories/product-search.repository";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductSearcher {
  constructor(private readonly productSearchRepository: ProductSearchRepository) {}

  public findAllProductsFromLatest(): Promise<ProductEntity[]> {
    return this.productSearchRepository.findAllProductsFromLatest();
  }

  public findAllProductsFromOldest(): Promise<ProductEntity[]> {
    return this.productSearchRepository.findAllProductsFromOldest();
  }

  public findProductWithId(id: string): Promise<ProductEntity> {
    return this.productSearchRepository.findProductWithId(id);
  }

  public findProductWithName(name: string): Promise<ProductEntity[]> {
    return this.productSearchRepository.findProductWithName(name);
  }
}
