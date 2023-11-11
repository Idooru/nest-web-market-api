import { Injectable } from "@nestjs/common";
import { ReviewUpdateService } from "./review-update.service";
import { InsertReviewImageDto } from "../dto/insert-review-image.dto";
import { InsertReviewVideoDto } from "../dto/insert-review-video.dto";
import { StarRatingDto } from "../dto/star-rating.dto";
import { ChangeReviewImageDto } from "../dto/change-review-image.dto";
import { ChangeReviewVideoDto } from "../dto/change-review-video.dto";
import { ModifyStarRateDto } from "../dto/modify-star-rate.dto";

@Injectable()
export class ReviewFactoryService {
  constructor(private readonly reviewUpdateService: ReviewUpdateService) {}

  public getInsertReviewImagesFunc(
    insertReviewImageDto: InsertReviewImageDto,
  ): () => Promise<void> {
    return async () =>
      await this.reviewUpdateService.insertReviewImages(insertReviewImageDto);
  }

  public getInsertReviewVideosFunc(
    insertReviewVideoDto: InsertReviewVideoDto,
  ): () => Promise<void> {
    return async () =>
      await this.reviewUpdateService.insertReviewVideos(insertReviewVideoDto);
  }

  public getIncreaseStarRateFunc(
    starRatingDto: StarRatingDto,
  ): () => Promise<void> {
    return async () =>
      await this.reviewUpdateService.increaseStarRate(starRatingDto);
  }

  public getChangeReviewImagesFunc(
    changeReviewImageDto: ChangeReviewImageDto,
  ): () => Promise<void> {
    return async () =>
      await this.reviewUpdateService.changeReviewImages(changeReviewImageDto);
  }

  public getChangeReviewVideosFunc(
    changeReviewVideoDto: ChangeReviewVideoDto,
  ): () => Promise<void> {
    return async () =>
      await this.reviewUpdateService.changeReviewVideos(changeReviewVideoDto);
  }

  public getModifyStarRateFunc(
    modifyStarRateDto: ModifyStarRateDto,
  ): () => Promise<void> {
    return async () =>
      await this.reviewUpdateService.modifyStarRate(modifyStarRateDto);
  }
}
