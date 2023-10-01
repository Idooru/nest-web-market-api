import { Injectable } from "@nestjs/common";
import { ProductSearchRepository } from "../repositories/product-search.repository";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductSearcher {
  constructor(
    private readonly productSearchRepository: ProductSearchRepository,
  ) {}

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    return await this.productSearchRepository.findAllProductsFromLatest();
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    return await this.productSearchRepository.findAllProductsFromOldest();
  }

  async findProductWithId(id: string): Promise<ProductEntity> {
    return await this.productSearchRepository.findProductWithId(id);
  }

  async findProductWithName(name: string): Promise<ProductEntity> {
    return await this.productSearchRepository.findProductWithName(name);
  }
}
