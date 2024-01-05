import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../../dto/create-product-dto";
import { UserSearcher } from "src/model/user/logic/user.searcher";
import { ProductUpdateService } from "../../services/product-update.service";
import { ProductFactoryService } from "../../services/product-factory.service";
import { MediaSearcher } from "src/model/media/logic/media.searcher";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { ProductSearcher } from "../product.searcher";
import { MediaCookieDto } from "../../../media/dto/media-cookie.dto";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { ProductRepositoryPayload } from "./product-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";

@Injectable()
export class ProductTransaction {
  constructor(
    private readonly transaction: Transactional<ProductRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly productSearcher: ProductSearcher,
    private readonly userSearcher: UserSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productUpdateService: ProductUpdateService,
    private readonly productFactoryService: ProductFactoryService,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const { productBodyDto, userId, productImgCookies } = createProductDto;

    const [admin, productImages] = await Promise.all([
      this.userSearcher.findAdminUserObjectWithId(userId),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    const queryRunner = await this.transaction.init();

    await (async () => {
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
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }

  async modifyProduct(modifyProductDto: ModifyProductDto): Promise<void> {
    const { id, productBodyDto, productImgCookies } = modifyProductDto;

    const [product, beforeProductImages, newProductImages] = await Promise.all([
      this.productSearcher.findProductWithId(id),
      this.mediaSearcher.findBeforeProductImagesWithId(id),
      this.mediaSearcher.findProductImagesWithId(productImgCookies),
    ]);

    const queryRunner = await this.transaction.init();

    await (async () => {
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
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
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

    const queryRunner = await this.transaction.init();

    await (async () => {
      const modifyProductImage =
        this.productFactoryService.getModifyProductImageFunc({
          beforeProductImages,
          newProductImages,
          product,
        });

      await modifyProductImage();
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }
}
