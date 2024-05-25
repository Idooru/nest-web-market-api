import { Injectable } from "@nestjs/common";
import { ReviewService } from "../../services/review.service";
import { SearchCreateReviewDto } from "../../dto/search-create-review.dto";
import { SearchModifyReviewDto } from "../../dto/search-modify-review.dto";
import { MediaUtils } from "../../../media/logic/media.utils";
import { SearchDeleteReviewDto } from "../../../product/dto/search-delete-review.dto";

@Injectable()
export class ReviewTransactionContext {
  constructor(private readonly reviewService: ReviewService, private readonly mediaUtils: MediaUtils) {}

  public createReviewContext(dto: SearchCreateReviewDto): () => Promise<void> {
    const { product, reviewBodyDto, reviewImages, reviewVideos, starRate, clientUser } = dto;

    return async () => {
      const review = await this.reviewService.createReview({
        reviewBodyDto,
        product,
        clientUser,
      });

      const imageWork = async () => {
        await this.reviewService.insertReviewImages({
          reviewImages,
          review,
        });
      };

      const videoWork = async () => {
        await this.reviewService.insertReviewVideos({
          reviewVideos,
          review,
        });
      };

      const starRateWork = async () => {
        await this.reviewService.increaseStarRate({
          scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
          starRate,
        });
      };

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
      await this.reviewService.modifyReview({ reviewBodyDto, review });

      const imageWork = async () => {
        await this.reviewService.changeReviewImages({
          beforeReviewImages,
          newReviewImages,
          review,
        });
      };

      const videoWork = async () => {
        await this.reviewService.changeReviewVideos({
          beforeReviewVideos,
          newReviewVideos,
          review,
        });
      };

      const starRateWork = async () => {
        await this.reviewService.modifyStarRate({
          review,
          starRate,
          scoreChosenByClient: reviewBodyDto.scoreChosenByClient,
        });
      };

      this.mediaUtils.deleteMediaFiles({
        images: beforeReviewImages,
        videos: beforeReviewVideos,
        mediaEntity: "review",
        callWhere: "remove media entity",
      });

      await Promise.all([imageWork(), videoWork(), starRateWork()]);
    };
  }

  public deleteReviewContext(dto: SearchDeleteReviewDto): () => Promise<void> {
    const { review, starRate } = dto;

    return async () => {
      await Promise.all([
        this.reviewService.deleteReviewWithId(review.id),
        this.reviewService.decreaseStarRate(review, starRate),
      ]);
    };
  }
}
