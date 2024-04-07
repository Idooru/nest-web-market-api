import { Injectable } from "@nestjs/common";
import { ReviewUpdateService } from "../../services/review-update.service";
import { ReviewFactoryService } from "../../services/review-factory.service";
import { SearchCreateReviewDto } from "../../dto/search-create-review.dto";
import { SearchModifyReviewDto } from "../../dto/search-modify-review.dto";
import { MediaUtils } from "../../../media/logic/media.utils";
import { SearchDeleteReviewDto } from "../../../product/dto/search-delete-review.dto";

@Injectable()
export class ReviewTransactionContext {
  constructor(
    private readonly reviewUpdateService: ReviewUpdateService,
    private readonly reviewFactoryService: ReviewFactoryService,
    private readonly mediaUtils: MediaUtils,
  ) {}

  public createReviewContext(dto: SearchCreateReviewDto): () => Promise<void> {
    const { product, reviewBodyDto, reviewImages, reviewVideos, starRate, clientUser } = dto;

    return async () => {
      const review = await this.reviewUpdateService.createReview({
        reviewBodyDto,
        product,
        clientUser,
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
    };
  }

  public modifyReviewContext(dto: SearchModifyReviewDto): () => Promise<void> {
    const {
      reviewBodyDto,
      review,
      beforeReviewImages,
      newReviewImages,
      beforeReviewVideos,
      newReviewVideos,
      starRate,
    } = dto;

    return async () => {
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
    };
  }

  public deleteReviewContext(dto: SearchDeleteReviewDto): () => Promise<void> {
    const { review, starRate } = dto;

    return async () => {
      await Promise.all([
        this.reviewUpdateService.deleteReviewWithId(review.id),
        this.reviewUpdateService.decreaseStarRate(review, starRate),
      ]);
    };
  }
}
