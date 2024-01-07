import { Injectable } from "@nestjs/common";
import { PrepareToCreateReviewDto } from "../../dto/create-review.dto";
import { PrepareToModifyReviewDto } from "../../dto/modify-review.dto";
import { DeleteReviewDto } from "../../dto/delete-review.dto";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { ReviewRepositoryPayload } from "./review-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { ReviewTransactionSearcher } from "./review-transaction.searcher";
import { ReviewTransactionContext } from "./review-transaction.context";

@Injectable()
export class ReviewTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<ReviewRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: ReviewTransactionSearcher,
    private readonly context: ReviewTransactionContext,
  ) {}

  public async createReview(dto: PrepareToCreateReviewDto): Promise<void> {
    const search = await this.searcher.searchCreateReview(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);
    await this.context
      .createReviewContext(search)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }

  public async modifyReview(dto: PrepareToModifyReviewDto): Promise<void> {
    const search = await this.searcher.searchModifyReview(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);
    await this.context
      .modifyReviewContext(search)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }

  public async deleteReview(dto: DeleteReviewDto): Promise<void> {
    const search = await this.searcher.searchDeleteReview(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);
    await this.context
      .deleteReviewContext(search)()
      .then(() => this.handler.commit())
      .catch((err) => this.handler.rollback(err))
      .finally(() => this.handler.release());
  }
}
