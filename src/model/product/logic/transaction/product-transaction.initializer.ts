import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { ProductRepositoryPayload } from "./product-repository.payload";
import { ProductEntity } from "../../entities/product.entity";
import { StarRateEntity } from "../../../review/entities/star-rate.entity";
import { ProductImageEntity } from "../../../media/entities/product-image.entity";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { Implemented } from "../../../../common/decorators/implemented.decoration";

@Injectable()
export class ProductTransactionInitializer extends Transactional<ProductRepositoryPayload> {
  private payload: ProductRepositoryPayload;

  constructor(private readonly dataSource: DataSource) {
    super();
  }

  @Implemented
  public async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.payload = {
      product: queryRunner.manager.getRepository(ProductEntity),
      starRate: queryRunner.manager.getRepository(StarRateEntity),
      productImage: queryRunner.manager.getRepository(ProductImageEntity),
    };

    return queryRunner;
  }

  @Implemented
  public getRepository(): ProductRepositoryPayload {
    return this.payload;
  }
}
