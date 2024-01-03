import { Injectable } from "@nestjs/common";
import { ReviewQueryRunnerProvider } from "./review-query-runner.provider";
import { ReviewUpdateService } from "../../services/review-update.service";
import { ReviewSearcher } from "../review.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { ReviewFactoryService } from "../../services/review-factory.service";
import { PrepareToCreateReviewDto } from "../../dto/create-review.dto";
import { PrepareToModifyReviewDto } from "../../dto/modify-review.dto";
import { ReviewUtils } from "../review.utils";
import { ReviewEntity } from "../../entities/review.entity";
import { DeleteReviewDto } from "../../dto/delete-review.dto";
import { ProductSearcher } from "../../../product/logic/product.searcher";
import { TransactionErrorHandler } from "../../../../common/lib/error-handler/transaction-error.handler";
import { MediaUtils } from "../../../media/logic/media.utils";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { ReviewRepositoryPayload } from "./review-repository.payload";

@Injectable()
export class ReviewTransaction {
  constructor(
    private readonly transaction: Transactional<ReviewRepositoryPayload>,
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly reviewUpdateService: ReviewUpdateService,
    private readonly reviewFactoryService: ReviewFactoryService,
    private readonly reviewUtils: ReviewUtils,
    private readonly transactionErrorHandler: TransactionErrorHandler,
    private readonly mediaUtils: MediaUtils,
  ) {}

  public async createReview(
    prepareToCreateReviewDto: PrepareToCreateReviewDto,
  ): Promise<void> {
    const {
      reviewBodyDto,
      userId,
      productId,
      reviewImgCookies,
      reviewVdoCookies,
    } = prepareToCreateReviewDto;

    const [product, client] = await this.reviewUtils.getProductAndClient(
      productId,
      userId,
    );

    this.reviewUtils.checkBeforeCreate(product, client);

    const [reviewImages, reviewVideos, starRate] = await Promise.all([
      this.mediaSearcher.findReviewImagesWithId(reviewImgCookies),
      this.mediaSearcher.findReviewVideosWithId(reviewVdoCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    const queryRunner = await this.transaction.init();

    try {
      const review = await this.reviewUpdateService.createReview({
        reviewBodyDto,
        product,
        client,
      });

      const imageWork = this.reviewFactoryService.getInsertReviewImagesFunc({
        reviewImages,
        review,
      });

      const videoWork = this.reviewFactoryService.getInsertReviewVideosFunc({
        reviewVideos,
        review,
      });

      const starRateWork = this.reviewFactoryService.getIncreaseStarRateFunc({
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
        starRate,
      });

      await Promise.all([imageWork(), videoWork(), starRateWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async modifyReview(
    prepareToModifyReviewDto: PrepareToModifyReviewDto,
  ): Promise<ReviewEntity> {
    const {
      reviewBodyDto,
      userId,
      productId,
      reviewId,
      reviewImgCookies,
      reviewVdoCookies,
    } = prepareToModifyReviewDto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.productSearcher.findProductWithId(productId);

    const [
      beforeReviewImages,
      newReviewImages,
      beforeReviewVideos,
      newReviewVideos,
      starRate,
    ] = await Promise.all([
      this.mediaSearcher.findBeforeReviewImagesWithId(review.id),
      this.mediaSearcher.findReviewImagesWithId(reviewImgCookies),
      this.mediaSearcher.findBeforeReviewVideosWithId(review.id),
      this.mediaSearcher.findReviewVideosWithId(reviewVdoCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    const queryRunner = await this.transaction.init();

    try {
      await this.reviewUpdateService.modifyReview({ reviewBodyDto, review });

      const imageWork = this.reviewFactoryService.getChangeReviewImagesFunc({
        beforeReviewImages,
        newReviewImages,
        review,
      });

      const videoWork = this.reviewFactoryService.getChangeReviewVideosFunc({
        beforeReviewVideos,
        newReviewVideos,
        review,
      });

      this.mediaUtils.deleteMediaFiles({
        images: beforeReviewImages,
        videos: beforeReviewVideos,
        mediaEntity: "review",
        callWhere: "remove media entity",
      });

      const starRateWork = this.reviewFactoryService.getModifyStarRateFunc({
        review,
        starRate,
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
      });

      await Promise.all([imageWork(), videoWork(), starRateWork()]);
      await queryRunner.commitTransaction();

      return review;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteReview(deleteReviewDto: DeleteReviewDto): Promise<void> {
    const { reviewId, productId, userId } = deleteReviewDto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const [product] = await this.reviewUtils.getProductAndClient(
      productId,
      userId,
    );

    const starRate = await this.reviewSearcher.findStarRateWithId(
      product.StarRate.id,
    );

    const queryRunner = await this.transaction.init();

    try {
      await Promise.all([
        this.reviewUpdateService.deleteReviewWithId(review.id),
        this.reviewUpdateService.decreaseStarRate(review, starRate),
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.transactionErrorHandler.handle(err);
    } finally {
      await queryRunner.release();
    }
  }
}
