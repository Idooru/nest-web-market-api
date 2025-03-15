import { Injectable } from "@nestjs/common";
import { ReviewService } from "../../services/review.service";
import { SearchCreateReviewDto } from "../../dto/search-create-review.dto";
import { SearchModifyReviewDto } from "../../dto/search-modify-review.dto";
import { MediaUtils } from "../../../media/logic/media.utils";
import { SearchDeleteReviewDto } from "../../../product/dto/search-delete-review.dto";
import { CreateReviewRowDto } from "../../dto/create-review.dto";
import { InsertReviewImagesDto } from "../../dto/insert-review-image.dto";
import { InsertReviewVideosDto } from "../../dto/insert-review-video.dto";
import { ModifyReviewRowDto } from "../../dto/modify-review.dto";
import { ChangeReviewImageDto } from "../../dto/change-review-image.dto";
import { ChangeReviewVideoDto } from "../../dto/change-review-video.dto";
import { ModifyStarRateDto } from "../../dto/modify-star-rate.dto";

@Injectable()
export class ReviewTransactionContext {
  constructor(private readonly reviewService: ReviewService, private readonly mediaUtils: MediaUtils) {}

  public async createReviewContext(dto: SearchCreateReviewDto): Promise<void> {
    const { productId, body, reviewImages, reviewVideos, starRate, reviewerId } = dto;

    const createReviewDto: CreateReviewRowDto = {
      body,
      productId,
      reviewerId,
    };

    const review = await this.reviewService.createReview(createReviewDto);

    const insertReviewImagesDto: InsertReviewImagesDto = {
      reviewId: review.id,
      reviewImages,
    };

    const insertReviewVideosDto: InsertReviewVideosDto = {
      reviewId: review.id,
      reviewVideos,
    };

    const increaseStartRateDto = { starRateScore: body.starRateScore, starRate };

    await Promise.all([
      this.reviewService.insertReviewImages(insertReviewImagesDto),
      this.reviewService.insertReviewVideos(insertReviewVideosDto),
      this.reviewService.increaseStarRate(increaseStartRateDto),
    ]);
  }

  public async modifyReviewContext(dto: SearchModifyReviewDto): Promise<void> {
    const { body, review, beforeReviewImages, newReviewImages, beforeReviewVideos, newReviewVideos, starRate } = dto;

    const modifyReviewDto: ModifyReviewRowDto = {
      review,
      body,
    };

    const changeReviewImageDto: ChangeReviewImageDto = {
      reviewId: review.id,
      beforeReviewImages,
      newReviewImages,
    };

    const changeReviewVideoDto: ChangeReviewVideoDto = {
      reviewId: review.id,
      beforeReviewVideos,
      newReviewVideos,
    };

    const modifyStarRateDto: ModifyStarRateDto = {
      review,
      starRate,
      starRateScore: body.starRateScore,
    };

    this.mediaUtils.deleteMediaFiles({
      images: beforeReviewImages,
      videos: beforeReviewVideos,
      mediaEntity: "review",
      callWhere: "remove media entity",
    });

    await Promise.all([
      this.reviewService.modifyReview(modifyReviewDto),
      this.reviewService.changeReviewImages(changeReviewImageDto),
      this.reviewService.changeReviewVideos(changeReviewVideoDto),
      this.reviewService.modifyStarRate(modifyStarRateDto),
    ]);
  }

  public async deleteReviewContext(dto: SearchDeleteReviewDto): Promise<void> {
    const { review, starRate } = dto;

    await Promise.all([
      this.reviewService.deleteReviewWithId(review.id),
      this.reviewService.decreaseStarRate(review, starRate),
    ]);
  }
}
