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
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";
import { ProductQueryRunnerProvider } from "./product-query-runner.provider";

@Injectable()
export class ProductTransaction {
  constructor(
    private readonly productQueryRunnerProvider: ProductQueryRunnerProvider,
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productOperationService: ProductOperationService,
    private readonly productFunctionService: ProductFunctionService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const queryRunner = await this.productQueryRunnerProvider.init();
    const { productBodyDto, userId, productImgCookies } = createProductDto;

    const [admin, productImages] = await Promise.all([
      this.userSearcher.findAdminUserObjectWithId(userId),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    try {
      const product = await this.productOperationService.createProduct({
        productBodyDto,
        admin,
      });

      const createStarRate = async () =>
        this.productFunctionService.getCreateStarRateFunc(product);

      const insertProductImage = async () =>
        this.productFunctionService.getInsertProductImageFunc({
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
    const queryRunner = await this.productQueryRunnerProvider.init();
    const { id, productBodyDto, productImgCookies } = modifyProductDto;

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImageWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    try {
      await this.productOperationService.modifyProduct({
        productBodyDto,
        product,
      });

      const modifyProductImage =
        this.productFunctionService.getModifyProductImageFunc({
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
    productImgCookies: MediaCookieDto[],
  ): Promise<void> {
    const queryRunner = await this.productQueryRunnerProvider.init();
    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImageWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    try {
      const modifyProductImage =
        this.productFunctionService.getModifyProductImageFunc({
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
