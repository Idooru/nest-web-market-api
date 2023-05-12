import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { InsertReviewMediaDto } from "../dto/insert-review-media.dto";
import { ModifyReviewMediaDto } from "../dto/modify-review-media.dto";
import { PushReviewMediaDto } from "../dto/push-review-media.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { ReviewAccessoryService } from "./review-accessory.service";
import { MediaAccessoryService } from "src/model/media/services/media-accessory.service";
import { brieflyFileName } from "src/common/functions/callbacks";
import { IReviewBundleService } from "../interfaces/services/review-bundle-service.interface";

@Injectable()
export class ReviewBundleService implements IReviewBundleService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly reviewAccessoryService: ReviewAccessoryService,
    private readonly mediaAccessoryService: MediaAccessoryService,
  ) {}

  checkModifyCount(review: ReviewEntity): void {
    if (review.countForModify === 0) {
      throw new UnauthorizedException("해당 리뷰는 더이상 수정할 수 없습니다.");
    }
  }

  async distinguishOwnReview(
    reviewId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    const client = await this.userGeneralRepository.findClientUserObjectWithId(
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

  async pushReviewMedia(pushReviewMediaDto: PushReviewMediaDto): Promise<void> {
    const { reviewRequestDto, reviewImgCookies, reviewVdoCookies } =
      pushReviewMediaDto;

    if (reviewImgCookies) {
      await this.reviewAccessoryService.pushReviewImages({
        reviewRequestDto,
        reviewImgCookies,
      });
    }

    if (reviewVdoCookies) {
      await this.reviewAccessoryService.pushReviewVideos({
        reviewRequestDto,
        reviewVdoCookies,
      });
    }
  }

  async insertReviewMedia(
    insertReviewMediaDto: InsertReviewMediaDto,
  ): Promise<void> {
    const { reviewImgCookies, reviewVdoCookies, reviewRequestDto, review } =
      insertReviewMediaDto;

    if (reviewImgCookies) {
      await this.reviewAccessoryService.insertReviewImages(
        reviewImgCookies,
        reviewRequestDto,
        review,
      );
    }

    if (reviewVdoCookies) {
      await this.reviewAccessoryService.insertReviewVideos(
        reviewVdoCookies,
        reviewRequestDto,
        review,
      );
    }
  }

  async modifyReviewMedia(
    modifyReviewMediaDto: ModifyReviewMediaDto,
  ): Promise<void> {
    const { reviewRequestDto, review, reviewImgCookies, reviewVdoCookies } =
      modifyReviewMediaDto;

    if (reviewImgCookies) {
      await this.reviewAccessoryService.modifyReviewImages(
        reviewImgCookies,
        reviewRequestDto,
        review,
      );
    }

    if (reviewVdoCookies) {
      await this.reviewAccessoryService.modifyReviewVideos(
        reviewVdoCookies,
        reviewRequestDto,
        review,
      );
    }
  }

  async deleteReviewMedia(review: ReviewEntity): Promise<void> {
    if (review.Image.length >= 1) {
      review.Image.map(brieflyFileName).forEach((name) =>
        this.mediaAccessoryService.deleteMediaFilesOnServerDisk(
          name,
          "/image/review",
        ),
      );

      await this.reviewAccessoryService.deleteReviewImages(
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

      await this.reviewAccessoryService.deleteReviewVideos(
        review.Video,
        review,
      );
    }
  }
}
