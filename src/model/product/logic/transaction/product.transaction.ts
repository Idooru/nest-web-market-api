import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../../dto/create-product-dto";
import { UserSearcher } from "src/model/user/logic/user.searcher";
import { ProductOperationService } from "../../services/product-operation.service";
import { ProductFunctionService } from "../../services/product-function.service";
import { loggerFactory } from "src/common/functions/logger.factory";
import { TypeOrmException } from "src/common/errors/typeorm.exception";
import { MediaSearcher } from "src/model/media/logic/media.searcher";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { ProductSearcher } from "../product.searcher";
import { MediaDto } from "../../../media/dto/media.dto";
import { ProductValidator } from "./product.validator";
import { ProductInit } from "./product.init";

@Injectable()
export class ProductTransaction {
  constructor(
    private readonly productInit: ProductInit,
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productValidator: ProductValidator,
    private readonly productOperationService: ProductOperationService,
    private readonly productFunctionService: ProductFunctionService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const queryRunner = await this.productInit.init();
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
    const queryRunner = await this.productInit.init();
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
    const queryRunner = await this.productInit.init();
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