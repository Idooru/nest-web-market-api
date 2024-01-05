import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "../../dto/create-product-dto";
import { ModifyProductDto } from "../../dto/modify-product.dto";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { ProductRepositoryPayload } from "./product-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { ProductTransactionSearcher } from "./product-transaction.searcher";
import { ProductTransactionContext } from "./product-transaction.context";
import { ModifyProductImageDto } from "../../dto/modify-product-image.dto";

@Injectable()
export class ProductTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<ProductRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: ProductTransactionSearcher,
    private readonly context: ProductTransactionContext,
  ) {}

  public async createProduct(dto: CreateProductDto): Promise<void> {
    const search = await this.searcher.searchCreateProduct(dto);
    const queryRunner = await this.transaction.init();

    await this.context
      .createProductContext(search)()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }

  public async modifyProduct(dto: ModifyProductDto): Promise<void> {
    const search = await this.searcher.searchModifyProduct(dto);
    const queryRunner = await this.transaction.init();

    await this.context
      .modifyProductContext(search)()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }

  public async modifyProductImage(dto: ModifyProductImageDto): Promise<void> {
    const search = await this.searcher.searchModifyProductImage(dto);
    const queryRunner = await this.transaction.init();

    await this.context
      .modifyProductImageContext(search)()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }
}
