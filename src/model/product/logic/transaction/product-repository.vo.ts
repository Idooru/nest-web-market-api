import { Repository } from "typeorm";
import { ProductEntity } from "../../entities/product.entity";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";

export interface ProductRepositoryPayload {
  productRepository: Repository<ProductEntity>;
  starRateRepository: Repository<StarRateEntity>;
  productImageRepository: Repository<ProductImageEntity>;
}

export class ProductRepositoryVO {
  private _productRepository: Repository<ProductEntity>;
  private _starRateRepository: Repository<StarRateEntity>;
  private _productImageRepository: Repository<ProductImageEntity>;

  public setRepositoryPayload(
    repositoryPayload: ProductRepositoryPayload,
  ): void {
    const { productRepository, starRateRepository, productImageRepository } =
      repositoryPayload;

    this.productRepository = productRepository;
    this.starRateRepository = starRateRepository;
    this.productImageRepository = productImageRepository;
  }

  get productRepository(): Repository<ProductEntity> {
    return this._productRepository;
  }

  set productRepository(value: Repository<ProductEntity>) {
    this._productRepository = value;
  }

  get starRateRepository(): Repository<StarRateEntity> {
    return this._starRateRepository;
  }

  set starRateRepository(value: Repository<StarRateEntity>) {
    this._starRateRepository = value;
  }

  get productImageRepository(): Repository<ProductImageEntity> {
    return this._productImageRepository;
  }

  set productImageRepository(value: Repository<ProductImageEntity>) {
    this._productImageRepository = value;
  }
}
