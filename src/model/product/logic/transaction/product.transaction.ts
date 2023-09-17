import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import {
  ProductRepositoryPayload,
  ProductRepositoryVO,
} from "../product-repository.vo";
import { ProductEntity } from "../../entities/product.entity";
import { CreateProductDto } from "../../dto/create-product-dto";
import { UserSearcher } from "src/model/user/logic/user.searcher";
import { ProductOperationService } from "../../services/product-operation.service";
import { ProductFunctionService } from "../../services/product-function.service";
import { StarRateEntity } from "src/model/review/entities/star-rate.entity";
import { ProductImageEntity } from "src/model/media/entities/product-image.entity";
import { loggerFactory } from "src/common/functions/logger.factory";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { MediaSearcher } from "src/model/media/logic/media.searcher";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { ProductSearcher } from "../product.searcher";
import { MediaDto } from "../../../media/dto/media.dto";
import { ProductValidator } from "./product.validator";

@Injectable()
export class ProductTransaction {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productValidator: ProductValidator,
    private readonly productOperationService: ProductOperationService,
    private readonly productFunctionService: ProductFunctionService,
    private readonly productRepositoryVO: ProductRepositoryVO,
  ) {}

  async init(queryRunner: QueryRunner): Promise<void> {
    const repositoryPayload: ProductRepositoryPayload = {
      productRepository: queryRunner.manager.getRepository(ProductEntity),
      starRateRepository: queryRunner.manager.getRepository(StarRateEntity),
      productImageRepository:
        queryRunner.manager.getRepository(ProductImageEntity),
    };

    this.productRepositoryVO.setRepositoryPayload(repositoryPayload);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await this.init(queryRunner);

    const { productBodyDto, jwtPayload, productImgCookies } = createProductDto;

    await this.productValidator.validate(productBodyDto.name);

    const [admin, productImages] = await Promise.all([
      this.userSearcher.findAdminUserObjectWithId(jwtPayload.userId),
      this.mediaSearcher.findProductImageWithUrl(productImgCookies),
    ]);

    try {
      const product = await this.productOperationService.createProduct({
        productBodyDto,
        admin,
      });

      const createStarRate =
        await this.productFunctionService.getCreateStarRateFunc(product);

      const insertProductImage =
        await this.productFunctionService.getInsertProductImageFunc({
          productImages,
          product,
        });

      await Promise.all([createStarRate(), insertProductImage()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await this.init(queryRunner);

    const { id, productBodyDto, productImgCookies } = modifyProductDto;

    await this.productValidator.validate(productBodyDto.name);

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImageWithId(id),
      this.mediaSearcher.findProductImageWithUrl(productImgCookies),
    ]);

    try {
      await this.productOperationService.modifyProduct({
        productBodyDto,
        product,
      });

      const modifyProductImage =
        await this.productFunctionService.getModifyProductImageFunc({
          beforeProductImages,
          newProductImages,
          product,
        });

      await modifyProductImage();
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyProductImage(
    id: string,
    productImgCookies: MediaDto[],
  ): Promise<void> {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await this.init(queryRunner);

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImageWithId(id),
      this.mediaSearcher.findProductImageWithUrl(productImgCookies),
    ]);

    try {
      const modifyProductImage =
        await this.productFunctionService.getModifyProductImageFunc({
          beforeProductImages,
          newProductImages,
          product,
        });

      await modifyProductImage();
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
