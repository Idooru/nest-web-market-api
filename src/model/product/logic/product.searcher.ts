import { Injectable } from "@nestjs/common";
import { ProductSearchRepository } from "../repositories/product-search.repository";
import { ValidateLibrary } from "src/common/lib/util/validate.library";
import { ProductEntity } from "../entities/product.entity";

@Injectable()
export class ProductSearcher {
  constructor(
    private readonly productSearchRepository: ProductSearchRepository,
    private readonly validateLibrary: ValidateLibrary,
  ) {}

  async isInvalidProductName(name: string): Promise<void> {
    const boolean = await this.productSearchRepository.isInvalidProductName(
      name,
    );
    this.validateLibrary.isNoneExistData(boolean, "product name");
  }

  async findAllProductsFromLatest(): Promise<ProductEntity[]> {
    const products =
      await this.productSearchRepository.findAllProductsFromLatest();
    this.validateLibrary.isExistArray(products, "products");
    return products;
  }

  async findAllProductsFromOldest(): Promise<ProductEntity[]> {
    const products =
      await this.productSearchRepository.findAllProductsFromOldest();
    this.validateLibrary.isExistArray(products, "products");
    return products;
  }

  async findProductWithId(id: string): Promise<ProductEntity> {
    const product = await this.productSearchRepository.findProductWithId(id);
    this.validateLibrary.isExistData(product, "product id");
    return product;
  }

  async findProductWithName(name: string): Promise<ProductEntity> {
    const product = await this.productSearchRepository.findProductWithName(
      name,
    );
    this.validateLibrary.isExistData(product, "product name");
    return product;
  }

  async findProductHavingStarRate(id: string): Promise<ProductEntity> {
    const product =
      await this.productSearchRepository.findProductHavingStarRate(id);
    this.validateLibrary.isExistData(product, "product id");
    return product;
  }
}
