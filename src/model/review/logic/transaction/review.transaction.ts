import { Injectable } from "@nestjs/common";
import { ReviewUpdateService } from "../../services/review-update.service";
import { ReviewSearcher } from "../review.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { ReviewFactoryService } from "../../services/review-factory.service";
import { PrepareToCreateReviewDto } from "../../dto/create-review.dto";
import { PrepareToModifyReviewDto } from "../../dto/modify-review.dto";
import { ReviewUtils } from "../review.utils";
import { DeleteReviewDto } from "../../dto/delete-review.dto";
import { ProductSearcher } from "../../../product/logic/product.searcher";
import { MediaUtils } from "../../../media/logic/media.utils";
import { Transactional } from "../../../../common/interfaces/initializer/transactional";
import { ReviewRepositoryPayload } from "./review-repository.payload";
import { TransactionHandler } from "../../../../common/lib/handler/transaction.handler";

@Injectable()
export class ReviewTransaction {
  constructor(
    private readonly transaction: Transactional<ReviewRepositoryPayload>,
    private readonly handler: TransactionHandler,
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly reviewUpdateService: ReviewUpdateService,
    private readonly reviewFactoryService: ReviewFactoryService,
    private readonly reviewUtils: ReviewUtils,
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

    await (async () => {
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
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }

  public async modifyReview(
    prepareToModifyReviewDto: PrepareToModifyReviewDto,
  ): Promise<void> {
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

    await (async () => {
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
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
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

    await (async () => {
      await Promise.all([
        this.reviewUpdateService.deleteReviewWithId(review.id),
        this.reviewUpdateService.decreaseStarRate(review, starRate),
      ]);
    })()
      .then(() => this.handler.commit(queryRunner))
      .catch((err) => this.handler.rollback(queryRunner, err))
      .finally(() => this.handler.release(queryRunner));
  }
}
