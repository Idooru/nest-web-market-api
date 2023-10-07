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
  constructor(
    private readonly reviewOperationService: ReviewUpdateService,
  ) {}

  public getInsertReviewImagesFunc(
    insertReviewImageDto: InsertReviewImageDto,
  ): () => void {
    return async () =>
      await this.reviewOperationService.insertReviewImages(
        insertReviewImageDto,
      );
  }

  public getInsertReviewVideosFunc(
    insertReviewVideoDto: InsertReviewVideoDto,
  ): () => void {
    return async () =>
      await this.reviewOperationService.insertReviewVideos(
        insertReviewVideoDto,
      );
  }

  public getIncreaseStarRateFunc(starRatingDto: StarRatingDto): () => void {
    return async () =>
      await this.reviewOperationService.increaseStarRate(starRatingDto);
  }

  public getChangeReviewImagesFunc(
    changeReviewImageDto: ChangeReviewImageDto,
  ): () => void {
    return async () =>
      await this.reviewOperationService.changeReviewImages(
        changeReviewImageDto,
      );
  }

  public getChangeReviewVideosFunc(
    changeReviewVideoDto: ChangeReviewVideoDto,
  ): () => void {
    return async () =>
      await this.reviewOperationService.changeReviewVideos(
        changeReviewVideoDto,
      );
  }

  public getModifyStarRateFunc(
    modifyStarRateDto: ModifyStarRateDto,
  ): () => void {
    return async () =>
      await this.reviewOperationService.modifyStarRate(modifyStarRateDto);
  }
}
