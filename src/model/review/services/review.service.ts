import { Inject, Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewUpdateRepository } from "../repositories/review-update.repository";

import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewUtils } from "../logic/review.utils";
import { ReviewSearcher } from "../logic/review.searcher";
import { MediaUtils } from "../../media/logic/media.utils";
import { Transaction } from "../../../common/decorators/transaction.decorator";
import { ReviewImageEntity } from "../../media/entities/review-image.entity";
import { ReviewVideoEntity } from "../../media/entities/review-video.entity";
import { InsertReviewImagesDto } from "../dto/request/insert-review-image.dto";
import { CreateReviewRowDto } from "../dto/request/create-review.dto";
import { InsertReviewVideosDto } from "../dto/request/insert-review-video.dto";
import { StarRatingDto } from "../dto/request/star-rating.dto";
import { ModifyReviewRowDto } from "../dto/request/modify-review.dto";
import { ChangeReviewImageDto } from "../dto/request/change-review-image.dto";
import { ChangeReviewVideoDto } from "../dto/request/change-review-video.dto";
import { ModifyStarRateDto } from "../dto/request/modify-star-rate.dto";

class EntityFinder {
  constructor(private readonly reviewIdFilter: string, private readonly reviewSearcher: ReviewSearcher) {}

  public findReview(reviewId: string): Promise<ReviewEntity> {
    return this.reviewSearcher.findEntity({
      property: this.reviewIdFilter,
      alias: { id: reviewId },
      getOne: true,
      entities: [ReviewImageEntity, ReviewVideoEntity],
    }) as Promise<ReviewEntity>;
  }
}

@Injectable()
export class ReviewService {
  private readonly entityFinder: EntityFinder;

  constructor(
    @Inject("review-id-filter")
    private readonly reviewIdFilter: string,
    private readonly reviewUtils: ReviewUtils,
    private readonly reviewUpdateRepository: ReviewUpdateRepository,
    private readonly reviewSearcher: ReviewSearcher,
    private readonly mediaUtils: MediaUtils,
  ) {
    this.entityFinder = new EntityFinder(this.reviewIdFilter, this.reviewSearcher);
  }

  @Transaction
  public createReview(dto: CreateReviewRowDto): Promise<ReviewEntity> {
    return this.reviewUpdateRepository.createReview(dto);
  }

  @Transaction
  public async insertReviewImages({ reviewImages, reviewId }: InsertReviewImagesDto): Promise<void> {
    const inserting = reviewImages.map((reviewImage) => {
      const insertReviewImageDto = { reviewId, reviewImageId: reviewImage.id };
      return this.reviewUpdateRepository.insertReviewIdOnReviewImage(insertReviewImageDto);
    });

    await Promise.all(inserting);
  }

  @Transaction
  public async insertReviewVideos({ reviewVideos, reviewId }: InsertReviewVideosDto): Promise<void> {
    const inserting = reviewVideos.map((reviewVideo) => {
      const insertReviewVideoDto = { reviewId, reviewVideoId: reviewVideo.id };
      return this.reviewUpdateRepository.insertReviewIdOnReviewVideo(insertReviewVideoDto);
    });

    await Promise.all(inserting);
  }

  @Transaction
  public async increaseStarRate({ starRateScore, starRate }: StarRatingDto): Promise<void> {
    await this.reviewUpdateRepository.increaseStarRate(starRateScore, starRate);

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewUpdateRepository.renewAverage(updatedStarRate);
  }

  @Transaction
  public async modifyReview(dto: ModifyReviewRowDto): Promise<void> {
    await this.reviewUpdateRepository.modifyReview(dto);
  }

  @Transaction
  public async changeReviewImages(dto: ChangeReviewImageDto): Promise<void> {
    const { beforeReviewImages, newReviewImages, reviewId } = dto;

    const inserting = newReviewImages.map((reviewImage) => {
      const insertReviewImageDto = { reviewId, reviewImageId: reviewImage.id };
      return this.reviewUpdateRepository.insertReviewIdOnReviewImage(insertReviewImageDto);
    });

    await Promise.all(inserting);

    if (beforeReviewImages.length >= 1) {
      const deleting = beforeReviewImages.map((reviewImage) =>
        this.reviewUpdateRepository.deleteReviewImageWithId(reviewImage.id),
      );

      await Promise.all(deleting);
    }
  }

  @Transaction
  public async changeReviewVideos(dto: ChangeReviewVideoDto): Promise<void> {
    const { beforeReviewVideos, newReviewVideos, reviewId } = dto;

    const inserting = newReviewVideos.map((reviewVideo) => {
      const insertReviewImageDto = { reviewId, reviewVideoId: reviewVideo.id };
      return this.reviewUpdateRepository.insertReviewIdOnReviewVideo(insertReviewImageDto);
    });

    await Promise.all(inserting);

    if (beforeReviewVideos.length >= 1) {
      const deleting = beforeReviewVideos.map((reviewVideo) =>
        this.reviewUpdateRepository.deleteReviewVideoWithId(reviewVideo.id),
      );

      await Promise.all(deleting);
    }
  }

  @Transaction
  public async modifyStarRate({ starRateScore, starRate, review }: ModifyStarRateDto): Promise<void> {
    const beforeScore = review.starRateScore;

    if (beforeScore === starRateScore) return;

    await Promise.all([
      this.reviewUpdateRepository.decreaseStarRate(starRate, beforeScore),
      this.reviewUpdateRepository.increaseStarRate(starRateScore, starRate),
    ]);

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewUpdateRepository.renewAverage(updatedStarRate);
  }

  @Transaction
  public async deleteReviewWithId(id: string): Promise<void> {
    const review = await this.entityFinder.findReview(id);

    this.mediaUtils.deleteMediaFiles({
      images: review.ReviewImage,
      videos: review.ReviewVideo,
      mediaEntity: "review",
      callWhere: "remove media entity",
    });

    await this.reviewUpdateRepository.deleteReviewWithId(id);
  }

  @Transaction
  public async decreaseStarRate(review: ReviewEntity, starRate: StarRateEntity): Promise<void> {
    const beforeScore = review.starRateScore;

    await this.reviewUpdateRepository.decreaseStarRate(starRate, beforeScore);

    const updatedStarRate = await this.reviewUtils.calculateStarRate(starRate);
    await this.reviewUpdateRepository.renewAverage(updatedStarRate);
  }
}
