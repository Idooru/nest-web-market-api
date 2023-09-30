import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewOperationRepository } from "../repositories/review-operation.repository";
import { InsertReviewImageDto } from "../dto/insert-review-image.dto";
import { InsertReviewVideoDto } from "../dto/insert-review-video.dto";
import { StarRatingDto1 } from "../dto/star-rating.dto";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { ChangeReviewImageDto } from "../dto/change-review-image.dto";
import { ChangeReviewVideoDto } from "../dto/change-review-video.dto";
import { ModifyStarRateDto1 } from "../dto/modify-star-rate.dto";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewUtils } from "../logic/review.utils";

@Injectable()
export class ReviewOperationService {
  constructor(
    private readonly reviewUtils: ReviewUtils,
    private readonly reviewOperationRepository: ReviewOperationRepository,
  ) {}

  // Transaction
  public async createReview(
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    return await this.reviewOperationRepository.createReview(createReviewDto);
  }

  // Transaction
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

  // Transaction
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

  // Transaction
  public async increaseStarRate(starRatingDto: StarRatingDto1): Promise<void> {
    const { scoreChosenByClient, starRate } = starRatingDto;

    await this.reviewOperationRepository.increaseStarRate(
      scoreChosenByClient,
      starRate,
    );

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewOperationRepository.renewTotalScore(updatedStarRate);
  }

  // Transaction
  public async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    await this.reviewOperationRepository.modifyReview(modifyReviewDto);
  }

  // Transaction
  public async changeReviewImages(
    changeReviewImageDto: ChangeReviewImageDto,
  ): Promise<void> {
    const { beforeReviewImages, newReviewImages, review } =
      changeReviewImageDto;

    const modifyWork = newReviewImages.map((reviewImage) =>
      this.reviewOperationRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      ),
    );

    await Promise.all(modifyWork);

    if (beforeReviewImages.length >= 1) {
      const deleteWork = beforeReviewImages.map((reviewImage) =>
        this.reviewOperationRepository.deleteReviewImageWithId(reviewImage.id),
      );

      await Promise.all(deleteWork);
    }
  }

  // Transaction
  public async changeReviewVideos(
    changeReviewVideoDto: ChangeReviewVideoDto,
  ): Promise<void> {
    const { beforeReviewVideos, newReviewVideos, review } =
      changeReviewVideoDto;

    const modifyWork = newReviewVideos.map((reviewVideo) =>
      this.reviewOperationRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      ),
    );

    await Promise.all(modifyWork);

    if (beforeReviewVideos.length >= 1) {
      const deleteWork = beforeReviewVideos.map((reviewVideo) =>
        this.reviewOperationRepository.deleteReviewVideoWithId(reviewVideo.id),
      );

      await Promise.all(deleteWork);
    }
  }

  // Transaction
  public async modifyStarRate(
    modifyStarRateDto: ModifyStarRateDto1,
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
  }

  // Transaction
  public async deleteReviewWithId(id: string): Promise<void> {
    await this.reviewOperationRepository.deleteReviewWithId(id);
  }

  // Transaction
  public async decreaseStarRate(
    review: ReviewEntity,
    starRate: StarRateEntity,
  ): Promise<void> {
    const beforeScore = review.scoreChosenByClient;

    await this.reviewOperationRepository.decreaseStarRate(
      starRate,
      beforeScore,
    );
  }
}
