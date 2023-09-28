import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import {
  ProductRepositoryPayload,
  ProductRepositoryVO,
} from "../product-repository.vo";
import { ProductEntity } from "../../entities/product.entity";
import { StarRateEntity } from "../../../review/entities/star-rate.entity";
import { ProductImageEntity } from "../../../media/entities/product-image.entity";

@Injectable()
export class ProductQueryRunnerInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productRepositoryVO: ProductRepositoryVO,
  ) {}

  async init(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repositoryPayload: ProductRepositoryPayload = {
      productRepository: queryRunner.manager.getRepository(ProductEntity),
      starRateRepository: queryRunner.manager.getRepository(StarRateEntity),
      productImageRepository:
        queryRunner.manager.getRepository(ProductImageEntity),
    };

    this.productRepositoryVO.setRepositoryPayload(repositoryPayload);

    return queryRunner;
  }
}
