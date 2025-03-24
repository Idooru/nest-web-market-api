import { Injectable } from "@nestjs/common";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { ReviewRepositoryPayload } from "./review-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";
import { ReviewTransactionSearcher } from "./review-transaction.searcher";
import { ReviewTransactionContext } from "./review-transaction.context";
import { CreateReviewDto } from "../../dto/request/create-review.dto";
import { ModifyReviewDto } from "../../dto/request/modify-review.dto";
import { DeleteReviewDto } from "../../dto/request/delete-review.dto";

@Injectable()
export class ReviewTransactionExecutor {
  constructor(
    private readonly transaction: Transactional<ReviewRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly searcher: ReviewTransactionSearcher,
    private readonly context: ReviewTransactionContext,
  ) {}

  public async createReview(dto: CreateReviewDto): Promise<void> {
    const search = await this.searcher.searchCreateReview(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.createReviewContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }

  public async modifyReview(dto: ModifyReviewDto): Promise<void> {
    const search = await this.searcher.searchModifyReview(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.modifyReviewContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }

  public async deleteReview(dto: DeleteReviewDto): Promise<void> {
    const search = await this.searcher.searchDeleteReview(dto);
    const queryRunner = await this.transaction.init();

    this.handler.setQueryRunner(queryRunner);

    try {
      await this.context.deleteReviewContext(search);
      await this.handler.commit();
    } catch (err) {
      await this.handler.rollback(err);
    } finally {
      await this.handler.release();
    }
  }
}
