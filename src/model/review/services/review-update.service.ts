import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewUpdateRepository } from "../repositories/review-update.repository";
import { InsertReviewImageDto } from "../dto/insert-review-image.dto";
import { InsertReviewVideoDto } from "../dto/insert-review-video.dto";
import { StarRatingDto } from "../dto/star-rating.dto";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { ChangeReviewImageDto } from "../dto/change-review-image.dto";
import { ChangeReviewVideoDto } from "../dto/change-review-video.dto";
import { ModifyStarRateDto } from "../dto/modify-star-rate.dto";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewUtils } from "../logic/review.utils";
import { ReviewSearcher } from "../logic/review.searcher";
import { MediaUtils } from "../../media/logic/media.utils";
import { Transaction } from "../../../common/decorators/transaction.decorator";

@Injectable()
export class ReviewUpdateService {
  constructor(
    private readonly reviewUtils: ReviewUtils,
    private readonly reviewOperationRepository: ReviewUpdateRepository,
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaUtils: MediaUtils,
  ) {}

  @Transaction
  public createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    return this.reviewOperationRepository.createReview(createReviewDto);
  }

  @Transaction
  public async insertReviewImages(
    insertReviewImageDto: InsertReviewImageDto,
  ): Promise<void> {
    const { reviewImages, review } = insertReviewImageDto;
    const inserting = reviewImages.map((reviewImage) =>
      this.reviewOperationRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      ),
    );

    await Promise.all(inserting);
  }

  @Transaction
  public async insertReviewVideos(
    insertReviewVideoDto: InsertReviewVideoDto,
  ): Promise<void> {
    const { reviewVideos, review } = insertReviewVideoDto;
    const inserting = reviewVideos.map((reviewVideo) =>
      this.reviewOperationRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      ),
    );

    await Promise.all(inserting);
  }

  @Transaction
  public async increaseStarRate(starRatingDto: StarRatingDto): Promise<void> {
    const { scoreChosenByClient, starRate } = starRatingDto;

    await this.reviewOperationRepository.increaseStarRate(
      scoreChosenByClient,
      starRate,
    );

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewOperationRepository.renewAverage(updatedStarRate);
  }

  @Transaction
  public async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    await this.reviewOperationRepository.modifyReview(modifyReviewDto);
  }

  @Transaction
  public async changeReviewImages(
    changeReviewImageDto: ChangeReviewImageDto,
  ): Promise<void> {
    const { beforeReviewImages, newReviewImages, review } =
      changeReviewImageDto;

    const inserting = newReviewImages.map((reviewImage) =>
      this.reviewOperationRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      ),
    );

    await Promise.all(inserting);

    if (beforeReviewImages.length >= 1) {
      const deleting = beforeReviewImages.map((reviewImage) =>
        this.reviewOperationRepository.deleteReviewImageWithId(reviewImage.id),
      );

      await Promise.all(deleting);
    }
  }

  @Transaction
  public async changeReviewVideos(
    changeReviewVideoDto: ChangeReviewVideoDto,
  ): Promise<void> {
    const { beforeReviewVideos, newReviewVideos, review } =
      changeReviewVideoDto;

    const inserting = newReviewVideos.map((reviewVideo) =>
      this.reviewOperationRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      ),
    );

    await Promise.all(inserting);

    if (beforeReviewVideos.length >= 1) {
      const deleting = beforeReviewVideos.map((reviewVideo) =>
        this.reviewOperationRepository.deleteReviewVideoWithId(reviewVideo.id),
      );

      await Promise.all(deleting);
    }
  }

  @Transaction
  public async modifyStarRate(
    modifyStarRateDto: ModifyStarRateDto,
  ): Promise<void> {
    const { scoreChosenByClient, starRate, review } = modifyStarRateDto;
    const beforeScore = review.scoreChosenByClient;

    if (beforeScore === scoreChosenByClient) return;

    await Promise.all([
      this.reviewOperationRepository.decreaseStarRate(starRate, beforeScore),
      this.reviewOperationRepository.increaseStarRate(
        scoreChosenByClient,
        starRate,
      ),
    ]);

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewOperationRepository.renewAverage(updatedStarRate);
  }

  @Transaction
  public async deleteReviewWithId(id: string): Promise<void> {
    const review = await this.reviewSearcher.findReviewWithId(id);

    this.mediaUtils.deleteMediaFiles({
      images: review.Image,
      videos: review.Video,
      mediaEntity: "review",
      callWhere: "remove media entity",
    });

    await this.reviewOperationRepository.deleteReviewWithId(id);
  }

  @Transaction
  public async decreaseStarRate(
    review: ReviewEntity,
    starRate: StarRateEntity,
  ): Promise<void> {
    const beforeScore = review.scoreChosenByClient;

    await this.reviewOperationRepository.decreaseStarRate(
      starRate,
      beforeScore,
    );

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewOperationRepository.renewAverage(updatedStarRate);
  }
}
