import { Repository } from "typeorm";
import { ProductEntity } from "../entities/product.entity";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";

export interface ProductRepositoryPayload {
  productRepository: Repository<ProductEntity>;
  starRateRepository: Repository<StarRateEntity>;
  productImageRepository: Repository<ProductImageEntity>;
}

export class ProductRepositoryVO {
  private productRepository: Repository<ProductEntity>;
  starRateRepository: Repository<StarRateEntity>;
  productImageRepository: Repository<ProductImageEntity>;

  public setRepositoryPayload(
    repositoryPayload: ProductRepositoryPayload,
  ): void {
    const { productRepository, starRateRepository, productImageRepository } =
      repositoryPayload;

    this.setProductRepository(productRepository);
    this.setStarRateRepository(starRateRepository);
    this.setProductImageRepository(productImageRepository);
  }

  public getProductRepository(): Repository<ProductEntity> {
    return this.productRepository;
  }

  public setProductRepository(
    productRepository: Repository<ProductEntity>,
  ): void {
    this.productRepository = productRepository;
  }

  public getStarRateRepository(): Repository<StarRateEntity> {
    return this.starRateRepository;
  }

  public setStarRateRepository(
    starRateRepository: Repository<StarRateEntity>,
  ): void {
    this.starRateRepository = starRateRepository;
  }

  public getProductImageRepository(): Repository<ProductImageEntity> {
    return this.productImageRepository;
  }

  public setProductImageRepository(
    productImageRepository: Repository<ProductImageEntity>,
  ): void {
    this.productImageRepository = productImageRepository;
  }
}
