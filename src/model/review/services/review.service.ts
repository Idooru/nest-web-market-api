import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewUpdateRepository } from "../repositories/review-update.repository";
import { InsertReviewImagesDto } from "../dto/insert-review-image.dto";
import { InsertReviewVideosDto } from "../dto/insert-review-video.dto";
import { StarRatingDto } from "../dto/star-rating.dto";
import { CreateReviewRowDto } from "../dto/create-review.dto";
import { ModifyReviewDto, ModifyReviewRowDto } from "../dto/modify-review.dto";
import { ChangeReviewImageDto } from "../dto/change-review-image.dto";
import { ChangeReviewVideoDto } from "../dto/change-review-video.dto";
import { ModifyStarRateDto } from "../dto/modify-star-rate.dto";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewUtils } from "../logic/review.utils";
import { ReviewSearcher } from "../logic/review.searcher";
import { MediaUtils } from "../../media/logic/media.utils";
import { Transaction } from "../../../common/decorators/transaction.decorator";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewUtils: ReviewUtils,
    private readonly reviewOperationRepository: ReviewUpdateRepository,
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaUtils: MediaUtils,
  ) {}

  @Transaction
  public createReview(dto: CreateReviewRowDto): Promise<ReviewEntity> {
    return this.reviewOperationRepository.createReview(dto);
  }

  @Transaction
  public async insertReviewImages({ reviewImages, reviewId }: InsertReviewImagesDto): Promise<void> {
    const inserting = reviewImages.map((reviewImage) => {
      const insertReviewImageDto = { reviewId, reviewImageId: reviewImage.id };
      return this.reviewOperationRepository.insertReviewIdOnReviewImage(insertReviewImageDto);
    });

    await Promise.all(inserting);
  }

  @Transaction
  public async insertReviewVideos({ reviewVideos, reviewId }: InsertReviewVideosDto): Promise<void> {
    const inserting = reviewVideos.map((reviewVideo) => {
      const insertReviewVideoDto = { reviewId, reviewVideoId: reviewVideo.id };
      return this.reviewOperationRepository.insertReviewIdOnReviewVideo(insertReviewVideoDto);
    });

    await Promise.all(inserting);
  }

  @Transaction
  public async increaseStarRate({ starRateScore, starRate }: StarRatingDto): Promise<void> {
    await this.reviewOperationRepository.increaseStarRate(starRateScore, starRate);

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewOperationRepository.renewAverage(updatedStarRate);
  }

  @Transaction
  public async modifyReview(dto: ModifyReviewRowDto): Promise<void> {
    await this.reviewOperationRepository.modifyReview(dto);
  }

  @Transaction
  public async changeReviewImages(dto: ChangeReviewImageDto): Promise<void> {
    const { beforeReviewImages, newReviewImages, reviewId } = dto;

    const inserting = newReviewImages.map((reviewImage) => {
      const insertReviewImageDto = { reviewId, reviewImageId: reviewImage.id };
      return this.reviewOperationRepository.insertReviewIdOnReviewImage(insertReviewImageDto);
    });

    await Promise.all(inserting);

    if (beforeReviewImages.length >= 1) {
      const deleting = beforeReviewImages.map((reviewImage) =>
        this.reviewOperationRepository.deleteReviewImageWithId(reviewImage.id),
      );

      await Promise.all(deleting);
    }
  }

  @Transaction
  public async changeReviewVideos(dto: ChangeReviewVideoDto): Promise<void> {
    const { beforeReviewVideos, newReviewVideos, reviewId } = dto;

    const inserting = newReviewVideos.map((reviewVideo) => {
      const insertReviewImageDto = { reviewId, reviewVideoId: reviewVideo.id };
      return this.reviewOperationRepository.insertReviewIdOnReviewVideo(insertReviewImageDto);
    });

    await Promise.all(inserting);

    if (beforeReviewVideos.length >= 1) {
      const deleting = beforeReviewVideos.map((reviewVideo) =>
        this.reviewOperationRepository.deleteReviewVideoWithId(reviewVideo.id),
      );

      await Promise.all(deleting);
    }
  }

  @Transaction
  public async modifyStarRate({ starRateScore, starRate, review }: ModifyStarRateDto): Promise<void> {
    const beforeScore = review.starRateScore;

    if (beforeScore === starRateScore) return;

    await Promise.all([
      this.reviewOperationRepository.decreaseStarRate(starRate, beforeScore),
      this.reviewOperationRepository.increaseStarRate(starRateScore, starRate),
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
  public async decreaseStarRate(review: ReviewEntity, starRate: StarRateEntity): Promise<void> {
    const beforeScore = review.starRateScore;

    await this.reviewOperationRepository.decreaseStarRate(starRate, beforeScore);

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewOperationRepository.renewAverage(updatedStarRate);
  }
}
