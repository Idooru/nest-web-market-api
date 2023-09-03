import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewAccessoryService } from "./review-accessory.service";
import { ReviewEntity } from "../entities/review.entity";
import { Injectable } from "@nestjs/common";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review-video.entity";

@Injectable()
export class ReviewFunctionService {
  constructor(
    private readonly reviewAccessoryService: ReviewAccessoryService,
  ) {}

  async insertReviewImage(
    review: ReviewEntity,
    reviewImgCookies: MediaDto[],
  ): Promise<() => void> {
    return () =>
      this.reviewAccessoryService
        .getReviewImages(reviewImgCookies)
        .then((reviewImages) =>
          this.reviewAccessoryService.insertReviewImages(review, reviewImages),
        );
  }

  async insertReviewVideo(
    review: ReviewEntity,
    reviewVdoCookies: MediaDto[],
  ): Promise<() => void> {
    return () =>
      this.reviewAccessoryService
        .getReviewVideos(reviewVdoCookies)
        .then((reviewVideos) =>
          this.reviewAccessoryService.insertReviewVideos(review, reviewVideos),
        );
  }

  async modifyReviewImage(
    review: ReviewEntity,
    reviewImgCookies: MediaDto[],
  ): Promise<() => void> {
    return () =>
      this.reviewAccessoryService
        .getReviewImages(reviewImgCookies)
        .then((reviewImages) =>
          this.reviewAccessoryService.modifyReviewImages(review, reviewImages),
        );
  }

  async modifyReviewVideo(
    review: ReviewEntity,
    reviewVdoCookis: MediaDto[],
  ): Promise<() => void> {
    return () =>
      this.reviewAccessoryService
        .getReviewVideos(reviewVdoCookis)
        .then((reviewVideos) =>
          this.reviewAccessoryService.modifyReviewVideos(review, reviewVideos),
        );
  }

  async deleteReviewImage(
    reviewImage: ReviewImageEntity[],
  ): Promise<() => void> {
    return () => this.reviewAccessoryService.deleteReviewImages(reviewImage);
  }

  async deleteReviewVideo(
    reviewVideo: ReviewVideoEntity[],
  ): Promise<() => void> {
    return () => this.reviewAccessoryService.deleteReviewVideos(reviewVideo);
  }
}
