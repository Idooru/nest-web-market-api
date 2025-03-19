import { Injectable } from "@nestjs/common";
import { ProductSearchRepository } from "../repositories/product-search.repository";
import { ProductEntity } from "../entities/product.entity";
import { ProductBasicRawDto } from "../dto/response/product-basic-raw.dto";
import { ProductDetailRawDto } from "../dto/response/product-detail-raw.dto";
import { MediaUtils } from "../../media/logic/media.utils";

@Injectable()
export class ProductSearcher {
  constructor(private readonly repository: ProductSearchRepository, private readonly mediaUtils: MediaUtils) {}

  private setBasicProductsRaw(products: ProductBasicRawDto[]) {
    products.forEach((product) => {
      product.reviewCount = parseInt(String(product.reviewCount));
      product.imageUrl ??= this.mediaUtils.setUrl("default_product_image.jpg", "product/images");
    });
  }

  public async findAllProductsFromLatest(): Promise<ProductBasicRawDto[]> {
    const products = await this.repository.findAllProducts("product.createdAt", "DESC");
    this.setBasicProductsRaw(products);
    return products;
  }

  public async findAllProductsFromOldest(): Promise<ProductBasicRawDto[]> {
    const products = await this.repository.findAllProducts("product.createdAt", "ASC");
    this.setBasicProductsRaw(products);
    return products;
  }

  public async findProductsWithName(name: string): Promise<ProductBasicRawDto[]> {
    const products = await this.repository.findProductsWithName(name);
    this.setBasicProductsRaw(products);
    return products;
  }

  public findProductWithId(id: string): Promise<ProductEntity> {
    return this.repository.findProductWithId(id);
  }
}
