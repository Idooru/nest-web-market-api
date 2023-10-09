import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../../dto/create-product-dto";
import { UserSearcher } from "src/model/user/logic/user.searcher";
import { ProductUpdateService } from "../../services/product-update.service";
import { ProductFactoryService } from "../../services/product-factory.service";
import { MediaSearcher } from "src/model/media/logic/media.searcher";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { ProductSearcher } from "../product.searcher";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";
import { ProductQueryRunnerProvider } from "./product-query-runner.provider";
import { TransactionErrorHandler } from "../../../../common/lib/error-handler/transaction-error.handler";

@Injectable()
export class ProductTransaction {
  constructor(
    private readonly productQueryRunnerProvider: ProductQueryRunnerProvider,
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productUpdateService: ProductUpdateService,
    private readonly productFactoryService: ProductFactoryService,
    private readonly transactionErrorHandler: TransactionErrorHandler,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { productBodyDto, userId, productImgCookies } = createProductDto;

    const [admin, productImages] = await Promise.all([
      this.userSearcher.findAdminUserObjectWithId(userId),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    const queryRunner = await this.productQueryRunnerProvider.init();

    try {
      const product = await this.productUpdateService.createProduct({
        productBodyDto,
        admin,
      });

      const createStarRate =
        this.productFactoryService.getCreateStarRateFunc(product);

      const insertProductImage =
        this.productFactoryService.getInsertProductImageFunc({
          productImages,
          product,
        });

      await Promise.all([createStarRate(), insertProductImage()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    const { id, productBodyDto, productImgCookies } = modifyProductDto;

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImagesWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    const queryRunner = await this.productQueryRunnerProvider.init();

    try {
      await this.productUpdateService.modifyProduct({
        productBodyDto,
        product,
      });

      const modifyProductImage =
        this.productFactoryService.getModifyProductImageFunc({
          beforeProductImages,
          newProductImages,
          product,
        });

      await modifyProductImage();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }

  async modifyProductImage(
    id: string,
    productImgCookies: MediaCookieDto[],
  ): Promise<void> {
    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImagesWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    const queryRunner = await this.productQueryRunnerProvider.init();

    try {
      const modifyProductImage =
        this.productFactoryService.getModifyProductImageFunc({
          beforeProductImages,
          newProductImages,
          product,
        });

      await modifyProductImage();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }
}
