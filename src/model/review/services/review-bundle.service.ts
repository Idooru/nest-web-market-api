import { Injectable, NotFoundException } from "@nestjs/common";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { InsertMediaDto } from "../dto/insert-media.dto";
import { ModifyMediaDto } from "../dto/modify-media.dto";
import { PushMediaDto } from "../dto/push-media.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { ReviewAccessoryService } from "./review-accessory.service";
import { MediaAccessoryService } from "src/model/media/services/media-accessory.service";
import { brieflyFileName } from "src/common/functions/callbacks";

@Injectable()
export class ReviewBundleService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly reviewAccessoryService: ReviewAccessoryService,
    private readonly mediaAccessoryService: MediaAccessoryService,
  ) {}

  async distinguishOwnReview(
    reviewId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    const client = await this.userGeneralRepository.findClientUserObject(
      userId,
    );

    const reviews = await this.reviewGeneralRepository.findAllClientsReviews(
      client.id,
    );

    const review = reviews.find((idx) => idx.id === reviewId);

    if (!review) {
      // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
      throw new NotFoundException(
        `고객 사용자의 아이디(${client.id})로 작성된 리뷰중에 reviewId(${reviewId})와 같은 리뷰를 찾을 수 없습니다.`,
      );
    }

    return review;
  }

  async pushMedia(pushMediaDto: PushMediaDto) {
    const { reviewRequestDto, reviewImgCookies, reviewVdoCookies } =
      pushMediaDto;

    if (reviewImgCookies) {
      await this.reviewAccessoryService.pushReviewImageInDto({
        reviewRequestDto,
        reviewImgCookies,
      });
    }
    if (reviewVdoCookies) {
      await this.reviewAccessoryService.pushReviewVideoInDto({
        reviewRequestDto,
        reviewVdoCookies,
      });
    }
  }

  async insertMedia(insertMediaDto: InsertMediaDto) {
    const { reviewImgCookies, reviewVdoCookies, reviewRequestDto, review } =
      insertMediaDto;

    if (reviewImgCookies) {
      await this.reviewAccessoryService.distinguishReviewImagesCountForInsert(
        reviewImgCookies,
        reviewRequestDto,
        review,
      );
    }

    if (reviewVdoCookies) {
      await this.reviewAccessoryService.distinguishReviewVideosCountForInsert(
        reviewVdoCookies,
        reviewRequestDto,
        review,
      );
    }
  }

  async modifyMedia(modifyMediaDto: ModifyMediaDto) {
    const { reviewRequestDto, review, reviewImgCookies, reviewVdoCookies } =
      modifyMediaDto;

    if (reviewImgCookies) {
      this.reviewAccessoryService.distinguishReviewImagesCountForModify(
        reviewImgCookies,
        reviewRequestDto,
        review,
      );
    }

    if (reviewVdoCookies) {
      this.reviewAccessoryService.distinguishReviewVideosCountForModify(
        reviewVdoCookies,
        reviewRequestDto,
        review,
      );
    }
  }

  async deleteMediaIfItHad(review: ReviewEntity) {
    if (review.Image.length >= 1) {
      review.Image.map(brieflyFileName).forEach((name) =>
        this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
          name,
          "/image/review",
        ),
      );

      await this.reviewAccessoryService.distinguishReviewImagesCountForDelete(
        review.Image,
        review,
      );
    }

    if (review.Video.length >= 1) {
      review.Video.map(brieflyFileName).forEach((name) =>
        this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
          name,
          "/video/review",
        ),
      );

      await this.reviewAccessoryService.distinguishReviewVideosCountForDelete(
        review.Video,
        review,
      );
    }
  }
}