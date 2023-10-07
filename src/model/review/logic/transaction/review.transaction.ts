import { Injectable } from "@nestjs/common";
import { ReviewQueryRunnerProvider } from "./review-query-runner.provider";
import { ReviewUpdateService } from "../../services/review-update.service";
import { ReviewSearcher } from "../review.searcher";
import { MediaSearcher } from "../../../media/logic/media.searcher";
import { ReviewFactoryService } from "../../services/review-factory.service";
import { loggerFactory } from "../../../../common/functions/logger.factory";
import { TypeOrmException } from "../../../../common/errors/typeorm.exception";
import {
  CreateReviewAllMediaDto,
  CreateReviewImageDto,
  CreateReviewNoMediaDto,
  CreateReviewVideoDto,
} from "../../dto/create-review.dto";
import {
  ModifyReviewAllMediaDto,
  ModifyReviewImageDto,
  ModifyReviewNoMediaDto,
  ModifyReviewVideoDto,
} from "../../dto/modify-review.dto";
import { ReviewUtils } from "../review.utils";
import { ReviewEntity } from "../../entities/review.entity";
import { DeleteReviewDto } from "../../dto/delete-review.dto";
import { ProductSearcher } from "../../../product/logic/product.searcher";

@Injectable()
export class ReviewTransaction {
  constructor(
    private readonly reviewQueryRunnerProvider: ReviewQueryRunnerProvider,
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaSearcher: MediaSearcher,
    private readonly productSearcher: ProductSearcher,
    private readonly reviewUpdateService: ReviewUpdateService,
    private readonly reviewFactoryService: ReviewFactoryService,
    private readonly reviewUtils: ReviewUtils,
  ) {}

  public async createReviewWithAllMedias(
    reviewAllMediaDto: CreateReviewAllMediaDto,
  ): Promise<void> {
    const {
      reviewBodyDto,
      userId,
      productId,
      reviewImgCookies,
      reviewVdoCookies,
    } = reviewAllMediaDto;

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

    const queryRunner = await this.reviewQueryRunnerProvider.init();

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
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createReviewWithImages(
    reviewImageDto: CreateReviewImageDto,
  ): Promise<void> {
    const { reviewBodyDto, userId, productId, reviewImgCookies } =
      reviewImageDto;

    const [product, client] = await this.reviewUtils.getProductAndClient(
      productId,
      userId,
    );

    this.reviewUtils.checkBeforeCreate(product, client);

    const [reviewImages, starRate] = await Promise.all([
      this.mediaSearcher.findReviewImagesWithId(reviewImgCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    const queryRunner = await this.reviewQueryRunnerProvider.init();

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

      const starRateWork = this.reviewFactoryService.getIncreaseStarRateFunc({
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
        starRate,
      });

      await Promise.all([imageWork(), starRateWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createReviewWithVideos(
    reviewVideoDto: CreateReviewVideoDto,
  ): Promise<void> {
    const { reviewBodyDto, userId, productId, reviewVdoCookies } =
      reviewVideoDto;

    const [product, client] = await this.reviewUtils.getProductAndClient(
      productId,
      userId,
    );

    this.reviewUtils.checkBeforeCreate(product, client);

    const [reviewVideos, starRate] = await Promise.all([
      this.mediaSearcher.findReviewVideosWithId(reviewVdoCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    const queryRunner = await this.reviewQueryRunnerProvider.init();

    try {
      const review = await this.reviewUpdateService.createReview({
        reviewBodyDto,
        product,
        client,
      });

      const videoWork = this.reviewFactoryService.getInsertReviewVideosFunc({
        reviewVideos,
        review,
      });

      const starRateWork = this.reviewFactoryService.getIncreaseStarRateFunc({
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
        starRate,
      });

      await Promise.all([videoWork(), starRateWork()]);
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async createReviewNoMedia(
    reviewNoMediaDto: CreateReviewNoMediaDto,
  ): Promise<void> {
    const { reviewBodyDto, userId, productId } = reviewNoMediaDto;

    const [product, client] = await this.reviewUtils.getProductAndClient(
      productId,
      userId,
    );

    this.reviewUtils.checkBeforeCreate(product, client);

    const starRate = await this.reviewSearcher.findStarRateWithId(
      product.StarRate.id,
    );

    const queryRunner = await this.reviewQueryRunnerProvider.init();

    try {
      await this.reviewUpdateService.createReview({
        reviewBodyDto,
        product,
        client,
      });

      const starRateWork = this.reviewFactoryService.getIncreaseStarRateFunc({
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
        starRate,
      });

      await starRateWork();
      await queryRunner.commitTransaction();
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async modifyReviewWithAllMedias(
    reviewAllMediaDto: ModifyReviewAllMediaDto,
  ): Promise<ReviewEntity> {
    const {
      reviewBodyDto,
      userId,
      productId,
      reviewId,
      reviewImgCookies,
      reviewVdoCookies,
    } = reviewAllMediaDto;

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

    const queryRunner = await this.reviewQueryRunnerProvider.init();

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

      const starRateWork = this.reviewFactoryService.getModifyStarRateFunc({
        review,
        starRate,
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
      });

      await Promise.all([imageWork(), videoWork(), starRateWork()]);
      await queryRunner.commitTransaction();

      return review;
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async modifyReviewWithImages(
    reviewImageDto: ModifyReviewImageDto,
  ): Promise<ReviewEntity> {
    const { reviewBodyDto, userId, productId, reviewId, reviewImgCookies } =
      reviewImageDto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.productSearcher.findProductWithId(productId);

    const [beforeReviewImages, newReviewImages, starRate] = await Promise.all([
      this.mediaSearcher.findBeforeReviewImagesWithId(review.id),
      this.mediaSearcher.findReviewImagesWithId(reviewImgCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    const queryRunner = await this.reviewQueryRunnerProvider.init();

    try {
      await this.reviewUpdateService.modifyReview({ reviewBodyDto, review });

      const imageWork = this.reviewFactoryService.getChangeReviewImagesFunc({
        beforeReviewImages,
        newReviewImages,
        review,
      });

      const starRateWork = this.reviewFactoryService.getModifyStarRateFunc({
        review,
        starRate,
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
      });

      await Promise.all([imageWork(), starRateWork()]);
      await queryRunner.commitTransaction();

      return review;
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async modifyReviewWithVideos(
    reviewVideoDto: ModifyReviewVideoDto,
  ): Promise<ReviewEntity> {
    const { reviewBodyDto, userId, productId, reviewId, reviewVdoCookies } =
      reviewVideoDto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.productSearcher.findProductWithId(productId);

    const [beforeReviewVideos, newReviewVideos, starRate] = await Promise.all([
      this.mediaSearcher.findBeforeReviewVideosWithId(review.id),
      this.mediaSearcher.findReviewVideosWithId(reviewVdoCookies),
      this.reviewSearcher.findStarRateWithId(product.StarRate.id),
    ]);

    const queryRunner = await this.reviewQueryRunnerProvider.init();

    try {
      await this.reviewUpdateService.modifyReview({ reviewBodyDto, review });

      const videoWork = this.reviewFactoryService.getChangeReviewVideosFunc({
        beforeReviewVideos,
        newReviewVideos,
        review,
      });

      const starRateWork = this.reviewFactoryService.getModifyStarRateFunc({
        review,
        starRate,
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
      });

      await Promise.all([videoWork(), starRateWork()]);
      await queryRunner.commitTransaction();

      return review;
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async modifyReviewNoMedia(
    reviewNoMediaDto: ModifyReviewNoMediaDto,
  ): Promise<ReviewEntity> {
    const { reviewBodyDto, userId, productId, reviewId } = reviewNoMediaDto;

    const review = await this.reviewUtils.checkBeforeModify(reviewId, userId);
    const product = await this.productSearcher.findProductWithId(productId);
    const starRate = await this.reviewSearcher.findStarRateWithId(
      product.StarRate.id,
    );

    const queryRunner = await this.reviewQueryRunnerProvider.init();

    try {
      await this.reviewUpdateService.modifyReview({ reviewBodyDto, review });

      const starRateWork = this.reviewFactoryService.getModifyStarRateFunc({
        review,
        starRate,
        scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
      });

      await Promise.all([starRateWork()]);
      await queryRunner.commitTransaction();

      return review;
    } catch (err) {
      loggerFactory("Transaction").error(err);
      await queryRunner.rollbackTransaction();
      throw new TypeOrmException(err);
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

    const queryRunner = await this.reviewQueryRunnerProvider.init();

    try {
      await Promise.all([
        this.reviewUpdateService.deleteReviewWithId(review.id),
        this.reviewUpdateService.decreaseStarRate(review, starRate),
      ]);

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
