import { MediaDto } from "src/model/media/dto/media.dto";
import { ReviewRequestDto } from "../../dto/review-request.dto";
import { ReviewEntity } from "../../entities/review.entity";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review-video.entity";
import { PushReviewImageDto } from "../../dto/push-review-image.dto";
import { PushReviewVideoDto } from "../../dto/push-review-video.dto";

export interface IReviewAccessoryService {
  pushMoreThenTwoReviewImageInDto(
    reviewImgCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void>;
  pushOneReviewImageInDto(
    reviewImgCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void>;
  pushMoreThenTwoReviewVideoInDto(
    reviewVdoCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void>;
  pushOneReviewVideoInDto(
    reviewVdoCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void>;
  insertReviewIdOnMoreThenTwoReviewImage(
    reviewImages: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void>;
  insertReviewIdOnOneReviewImage(
    reviewImage: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void>;
  insertReviewIdOnMoreThenTwoReviewVideo(
    reviewVideos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void>;
  insertReviewIdOnOneReviewVideo(
    reviewVideo: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void>;
  deleteMoreThenTwoReviewImage(
    beforeReviewImages: ReviewImageEntity[],
  ): Promise<void>;
  deleteOneReviewImage(beforeReviewImage: ReviewImageEntity): Promise<void>;
  deleteMoreThenTwoReviewVideo(
    beforeReviewVideos: ReviewVideoEntity[],
  ): Promise<void>;
  deleteOneReviewVideo(beforeReviewVideo: ReviewVideoEntity): Promise<void>;
  pushReviewImages(pushReviewImageDto: PushReviewImageDto): Promise<void>;
  pushReviewVideos(pushReviewVideoDto: PushReviewVideoDto): Promise<void>;
  insertReviewImages(
    reviewImgCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void>;
  insertReviewVideos(
    reviewVdoCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void>;
  modifyReviewImages(
    reviewImgCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void>;
  modifyReviewVideos(
    reviewVdoCookies: MediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void>;
  deleteReviewImages(
    reviewImages: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void>;
  deleteReviewVideos(
    reviewVideos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void>;
}
