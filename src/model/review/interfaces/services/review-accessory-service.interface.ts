import { MediaCookieDto } from "src/model/media/dto/media-cookie.dto";
import { ReviewEntity } from "../../entities/review.entity";
import { ReviewImageEntity } from "src/model/media/entities/review-image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review-video.entity";

export interface IReviewAccessoryService {
  // pushMoreThenTwoReviewImageInDto(
  //   reviewImgCookies: MediaCookieDto[],
  //   reviewRequestDto: ReviewBodyDto,
  // ): Promise<void>;
  // pushOneReviewImageInDto(
  //   reviewImgCookies: MediaCookieDto[],
  //   reviewRequestDto: ReviewBodyDto,
  // ): Promise<void>;
  // pushMoreThenTwoReviewVideoInDto(
  //   reviewVdoCookies: MediaCookieDto[],
  //   reviewRequestDto: ReviewBodyDto,
  // ): Promise<void>;
  // pushOneReviewVideoInDto(
  //   reviewVdoCookies: MediaCookieDto[],
  //   reviewRequestDto: ReviewBodyDto,
  // ): Promise<void>;
  // insertReviewIdOnMoreThenTwoReviewImage(
  //   reviewImages: ReviewImageEntity[],
  //   review: ReviewEntity,
  // ): Promise<void>;
  // insertReviewIdOnOneReviewImage(
  //   reviewImage: ReviewImageEntity,
  //   review: ReviewEntity,
  // ): Promise<void>;
  // insertReviewIdOnMoreThenTwoReviewVideo(
  //   reviewVideos: ReviewVideoEntity[],
  //   review: ReviewEntity,
  // ): Promise<void>;
  // insertReviewIdOnOneReviewVideo(
  //   reviewVideo: ReviewVideoEntity,
  //   review: ReviewEntity,
  // ): Promise<void>;
  // deleteMoreThenTwoReviewImage(
  //   beforeReviewImages: ReviewImageEntity[],
  // ): Promise<void>;
  // deleteOneReviewImage(beforeReviewImage: ReviewImageEntity): Promise<void>;
  // deleteMoreThenTwoReviewVideo(
  //   beforeReviewVideos: ReviewVideoEntity[],
  // ): Promise<void>;
  // deleteOneReviewVideo(beforeReviewVideo: ReviewVideoEntity): Promise<void>;
  // pushReviewImages(pushReviewImageDto: PushReviewImageDto): Promise<void>;
  // pushReviewVideos(pushReviewVideoDto: PushReviewVideoDto): Promise<void>;
  getReviewImages(
    reviewImgCookies: MediaCookieDto[],
  ): Promise<ReviewImageEntity[]>;
  getReviewVideos(
    reviewVdoCookies: MediaCookieDto[],
  ): Promise<ReviewVideoEntity[]>;
  insertReviewImages(
    review: ReviewEntity,
    reviewImages: ReviewImageEntity[],
  ): Promise<void>;
  insertReviewVideos(
    review: ReviewEntity,
    reviewVideos: ReviewVideoEntity[],
  ): Promise<void>;
  modifyReviewImages(
    review: ReviewEntity,
    reviewImages: ReviewImageEntity[],
  ): Promise<void>;
  modifyReviewVideos(
    review: ReviewEntity,
    reviewVideos: ReviewVideoEntity[],
  ): Promise<void>;
  // deleteReviewImages(
  //   reviewImages: ReviewImageEntity[],
  //   review: ReviewEntity,
  // ): Promise<void>;
  // deleteReviewVideos(
  //   reviewVideos: ReviewVideoEntity[],
  //   review: ReviewEntity,
  // ): Promise<void>;
}
