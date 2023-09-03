import { Injectable } from "@nestjs/common";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review-video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { ReviewEntity } from "../entities/review.entity";
import { IReviewAccessoryService } from "../interfaces/services/review-accessory-service.interface";
import { MediaDto } from "src/model/media/dto/media.dto";

@Injectable()
export class ReviewAccessoryService implements IReviewAccessoryService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
  ) {}

  async getReviewImages(
    reviewImgCookies: MediaDto[],
  ): Promise<ReviewImageEntity[]> {
    const reviewImages = reviewImgCookies.map(async (reviewImgCookie) => {
      return await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookie.url,
      );
    });

    return await Promise.all(reviewImages);
  }

  async getReviewVideos(
    reviewVdoCookies: MediaDto[],
  ): Promise<ReviewVideoEntity[]> {
    const reviewVideos = reviewVdoCookies.map(async (reviewVdoCookie) => {
      return await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookie.url,
      );
    });

    return await Promise.all(reviewVideos);
  }

  async insertReviewImages(
    review: ReviewEntity,
    reviewImages: ReviewImageEntity[],
  ): Promise<void> {
    const insertWork = reviewImages.map(async (reviewImage) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      );
    });

    await Promise.all(insertWork);
  }

  async insertReviewVideos(
    review: ReviewEntity,
    reviewVideos: ReviewVideoEntity[],
  ): Promise<void> {
    const insertWork = reviewVideos.map(async (reviewVideo) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      );
    });

    await Promise.all(insertWork);
  }

  async modifyReviewImages(
    review: ReviewEntity,
    reviewImages: ReviewImageEntity[],
  ): Promise<void> {
    const beforeReviewImages =
      await this.mediaGeneralRepository.findBeforeReviewImagesWithId(review.id);

    const modifyWork = reviewImages.map(async (reviewImage) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      );
    });

    await Promise.all(modifyWork);

    if (beforeReviewImages.length >= 1) {
      const deleteWork = beforeReviewImages.map(async (beforeReviewImage) => {
        await this.mediaGeneralRepository.deleteReviewImageWithId(
          beforeReviewImage.id,
        );
      });

      await Promise.all(deleteWork);
    }
  }

  async modifyReviewVideos(
    review: ReviewEntity,
    reviewVideos: ReviewVideoEntity[],
  ): Promise<void> {
    const beforeReviewVideos =
      await this.mediaGeneralRepository.findBeforeReviewVideosWithId(review.id);

    const modifyWork = reviewVideos.map(async (reviewVideo) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      );
    });

    await Promise.all(modifyWork);

    if (beforeReviewVideos.length >= 1) {
      const deleteWork = beforeReviewVideos.map(async (beforeReviewVideo) => {
        await this.mediaGeneralRepository.deleteReviewVideoWithId(
          beforeReviewVideo.id,
        );
      });

      await Promise.all(deleteWork);
    }
  }

  async deleteReviewImages(reviewImages: ReviewImageEntity[]): Promise<void> {
    const deleteWork = reviewImages.map(async (reviewImage) => {
      await this.mediaGeneralRepository.deleteReviewImageWithId(reviewImage.id);
    });

    await Promise.all(deleteWork);
  }

  async deleteReviewVideos(reviewVideos: ReviewVideoEntity[]): Promise<void> {
    const deleteWork = reviewVideos.map(async (reviewVideo) => {
      await this.mediaGeneralRepository.deleteReviewVideoWithId(reviewVideo.id);
    });

    await Promise.all(deleteWork);
  }
}
