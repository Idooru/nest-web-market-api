import {
  PushReviewImageDto,
  PushReviewVideoDto,
  ReviewRequestDto,
} from "../dto/review-request.dto";
import { Injectable } from "@nestjs/common";
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { ReviewEntity } from "../entities/review.entity";

@Injectable()
export class ReviewAccessoryService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
  ) {}

  async pushReviewImageInDto(
    pushReviewImageDto: PushReviewImageDto,
  ): Promise<void> {
    const { reviewBody, reviewImgCookies } = pushReviewImageDto;

    reviewBody.Image = [];

    await this.distinguishReviewImagesCountForPush(
      reviewImgCookies,
      reviewBody,
    );
  }

  async pushReviewVideoInDto(
    pushReviewVideoDto: PushReviewVideoDto,
  ): Promise<void> {
    const { reviewBody, reviewVdoCookies } = pushReviewVideoDto;

    reviewBody.Video = [];

    await this.distinguishReviewVideosCountForPush(
      reviewVdoCookies,
      reviewBody,
    );
  }

  async pushMoreThenTwoReviewImageInDto(
    reviewImgCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
  ): Promise<void> {
    for (const reviewImgCookie of reviewImgCookies) {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookie.url,
      );
      reviewBody.Image.push(image);
    }
  }

  async pushOneReviewImageInDto(
    reviewImgCookies: RequestMediaDto[],
    reviewDto: ReviewRequestDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
      reviewImgCookies[0].url,
    );
    reviewDto.Image.push(image);
  }

  async pushMoreThenTwoReviewVideoInDto(
    reviewVdoCookies: RequestMediaDto[],
    reviewDto: ReviewRequestDto,
  ): Promise<void> {
    for (const reviewVdoCookie of reviewVdoCookies) {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookie.url,
      );
      reviewDto.Video.push(video);
    }
  }

  async pushOneReviewVideoInDto(
    reviewVdoCookies: RequestMediaDto[],
    reviewDto: ReviewRequestDto,
  ): Promise<void> {
    const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
      reviewVdoCookies[0].url,
    );
    reviewDto.Video.push(video);
  }

  async insertReviewIdOnMoreThenTwoReviewImage(
    images: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    for (const image of images) {
      await this.mediaInsertRepository.insertReviewIdOnReviewImage(
        image,
        review,
      );
    }
  }

  async insertReviewIdOnOneReviewImage(
    image: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertReviewIdOnReviewImage(image, review);
  }

  async insertReviewIdOnMoreThenTwoReviewVideo(
    videos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    for (const video of videos) {
      await this.mediaInsertRepository.insertReviewIdOnReviewVideo(
        video,
        review,
      );
    }
  }

  async insertReviewIdOnOneReviewVideo(
    video: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertReviewIdOnReviewVideo(video, review);
  }

  async deleteMoreThenTwoReviewImage(beforeImages: ReviewImageEntity[]) {
    for (const beforeImage of beforeImages) {
      await this.mediaGeneralRepository.deleteReviewImageWithId(beforeImage.id);
    }
  }

  async deleteOneReviewImage(beforeImage: ReviewImageEntity) {
    await this.mediaGeneralRepository.deleteReviewImageWithId(beforeImage.id);
  }

  async deleteMoreThenTwoReviewVideo(beforeVideos: ReviewVideoEntity[]) {
    for (const beforeVideo of beforeVideos) {
      await this.mediaGeneralRepository.deleteReviewVideoWithId(beforeVideo.id);
    }
  }

  async deleteOneReviewVideo(beforeVideo: ReviewVideoEntity) {
    await this.mediaGeneralRepository.deleteReviewVideoWithId(beforeVideo.id);
  }

  async distinguishReviewImagesCountForPush(
    reviewImgCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      await this.pushMoreThenTwoReviewImageInDto(reviewImgCookies, reviewBody);
    } else {
      await this.pushOneReviewImageInDto(reviewImgCookies, reviewBody);
    }
  }

  async distinguishReviewVideosCountForPush(
    reviewVdoCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      await this.pushMoreThenTwoReviewVideoInDto(reviewVdoCookies, reviewBody);
    } else {
      await this.pushOneReviewVideoInDto(reviewVdoCookies, reviewBody);
    }
  }

  async distinguishReviewImagesCountForInsert(
    reviewImgCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      await this.insertReviewIdOnMoreThenTwoReviewImage(
        reviewBody.Image,
        review,
      );
    } else {
      await this.insertReviewIdOnOneReviewImage(reviewBody.Image[0], review);
    }
  }

  async distinguishReviewVideosCountForInsert(
    reviewVdoCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      await this.insertReviewIdOnMoreThenTwoReviewVideo(
        reviewBody.Video,
        review,
      );
    } else {
      await this.insertReviewIdOnOneReviewVideo(reviewBody.Video[0], review);
    }
  }

  async distinguishReviewImagesCountForModify(
    reviewImgCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      const beforeImages =
        await this.mediaGeneralRepository.findBeforeReviewImages(review.id);
      await this.pushMoreThenTwoReviewImageInDto(reviewImgCookies, reviewBody);
      await Promise.all([
        this.insertReviewIdOnMoreThenTwoReviewImage(reviewBody.Image, review),
        this.deleteMoreThenTwoReviewImage(beforeImages),
      ]);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.pushOneReviewImageInDto(reviewImgCookies, reviewBody);
      await Promise.all([
        this.insertReviewIdOnOneReviewImage(reviewBody.Image[0], review),
        this.deleteOneReviewImage(beforeImage),
      ]);
    }
  }

  async distinguishReviewVideosCountForModify(
    reviewVdoCookies: RequestMediaDto[],
    reviewBody: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      const beforeVideos =
        await this.mediaGeneralRepository.findBeforeReviewVideos(review.id);
      await this.pushMoreThenTwoReviewVideoInDto(reviewVdoCookies, reviewBody);
      await Promise.all([
        this.insertReviewIdOnMoreThenTwoReviewVideo(reviewBody.Video, review),
        this.deleteMoreThenTwoReviewVideo(beforeVideos),
      ]);
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.pushOneReviewVideoInDto(reviewVdoCookies, reviewBody);
      await Promise.all([
        this.insertReviewIdOnOneReviewVideo(reviewBody.Video[0], review),
        this.deleteOneReviewVideo(beforeVideo),
      ]);
    }
  }

  async distinguishReviewImagesCountForDelete(
    reviewImages: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImages.length >= 2) {
      const beforeImages =
        await this.mediaGeneralRepository.findBeforeReviewImages(review.id);
      await this.deleteMoreThenTwoReviewImage(beforeImages);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.deleteOneReviewImage(beforeImage);
    }
  }

  async distinguishReviewVideosCountForDelete(
    reviewVideos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVideos.length >= 2) {
      const beforeVideos =
        await this.mediaGeneralRepository.findBeforeReviewVideos(review.id);
      await this.deleteMoreThenTwoReviewVideo(beforeVideos);
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.deleteOneReviewVideo(beforeVideo);
    }
  }
}
