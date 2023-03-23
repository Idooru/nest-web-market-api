import { ReviewRequestDto } from "../dto/review-request.dto";
import { Injectable } from "@nestjs/common";
import { RequestMediaDto } from "src/model/media/dto/request-media.dto";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { ReviewEntity } from "../entities/review.entity";
import { PushReviewImageDto } from "../dto/push-review-image.dto";
import { PushReviewVideoDto } from "../dto/push-review-video.dto";

@Injectable()
export class ReviewAccessoryService {
  constructor(
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
  ) {}

  async pushMoreThenTwoReviewImageInDto(
    reviewImgCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    const promises = reviewImgCookies.map(async (reviewImgCookie) => {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookie.url,
      );

      reviewRequestDto.Image.push(image);
    });

    await Promise.all(promises);
  }

  async pushOneReviewImageInDto(
    reviewImgCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
      reviewImgCookies[0].url,
    );

    reviewRequestDto.Image.push(image);
  }

  async pushMoreThenTwoReviewVideoInDto(
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    const promises = reviewVdoCookies.map(async (reviewVdoCookie) => {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookie.url,
      );

      reviewRequestDto.Video.push(video);
    });

    await Promise.all(promises);
  }

  async pushOneReviewVideoInDto(
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
      reviewVdoCookies[0].url,
    );

    reviewRequestDto.Video.push(video);
  }

  async insertReviewIdOnMoreThenTwoReviewImage(
    reviewImages: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    const promises = reviewImages.map(async (reviewImage) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      );
    });

    await Promise.all(promises);
  }

  async insertReviewIdOnOneReviewImage(
    reviewImage: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertReviewIdOnReviewImage(
      reviewImage,
      review,
    );
  }

  async insertReviewIdOnMoreThenTwoReviewVideo(
    reviewVideos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    const promises = reviewVideos.map(async (reviewVideo) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      );
    });

    await Promise.all(promises);
  }

  async insertReviewIdOnOneReviewVideo(
    reviewVideo: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.mediaInsertRepository.insertReviewIdOnReviewVideo(
      reviewVideo,
      review,
    );
  }

  async deleteMoreThenTwoReviewImage(beforeReviewImages: ReviewImageEntity[]) {
    const promises = beforeReviewImages.map(async (beforeReviewImage) => {
      await this.mediaGeneralRepository.deleteReviewImageWithId(
        beforeReviewImage.id,
      );
    });

    await Promise.all(promises);
  }

  async deleteOneReviewImage(beforeReviewImage: ReviewImageEntity) {
    await this.mediaGeneralRepository.deleteReviewImageWithId(
      beforeReviewImage.id,
    );
  }

  async deleteMoreThenTwoReviewVideo(beforeReviewVideos: ReviewVideoEntity[]) {
    const promises = beforeReviewVideos.map(async (beforeReviewVideo) => {
      await this.mediaGeneralRepository.deleteReviewVideoWithId(
        beforeReviewVideo.id,
      );
    });

    await Promise.all(promises);
  }

  async deleteOneReviewVideo(beforeReviewVideo: ReviewVideoEntity) {
    await this.mediaGeneralRepository.deleteReviewVideoWithId(
      beforeReviewVideo.id,
    );
  }

  async distinguishReviewImagesCountForPush(
    pushReviewImageDto: PushReviewImageDto,
  ): Promise<void> {
    const { reviewImgCookies, reviewRequestDto } = pushReviewImageDto;

    reviewRequestDto.Image = [];

    if (reviewImgCookies.length >= 2) {
      await this.pushMoreThenTwoReviewImageInDto(
        reviewImgCookies,
        reviewRequestDto,
      );
    } else {
      await this.pushOneReviewImageInDto(reviewImgCookies, reviewRequestDto);
    }
  }

  async distinguishReviewVideosCountForPush(
    pushReviewVideoDto: PushReviewVideoDto,
  ): Promise<void> {
    const { reviewVdoCookies, reviewRequestDto } = pushReviewVideoDto;

    reviewRequestDto.Video = [];

    if (reviewVdoCookies.length >= 2) {
      await this.pushMoreThenTwoReviewVideoInDto(
        reviewVdoCookies,
        reviewRequestDto,
      );
    } else {
      await this.pushOneReviewVideoInDto(reviewVdoCookies, reviewRequestDto);
    }
  }

  async distinguishReviewImagesCountForInsert(
    reviewImgCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      await this.insertReviewIdOnMoreThenTwoReviewImage(
        reviewRequestDto.Image,
        review,
      );
    } else {
      await this.insertReviewIdOnOneReviewImage(
        reviewRequestDto.Image[0],
        review,
      );
    }
  }

  async distinguishReviewVideosCountForInsert(
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      await this.insertReviewIdOnMoreThenTwoReviewVideo(
        reviewRequestDto.Video,
        review,
      );
    } else {
      await this.insertReviewIdOnOneReviewVideo(
        reviewRequestDto.Video[0],
        review,
      );
    }
  }

  async distinguishReviewImagesCountForModify(
    reviewImgCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      const beforeImages =
        await this.mediaGeneralRepository.findBeforeReviewImages(review.id);
      await this.insertReviewIdOnMoreThenTwoReviewImage(
        reviewRequestDto.Image,
        review,
      );
      if (beforeImages.length >= 1)
        this.deleteMoreThenTwoReviewImage(beforeImages);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.insertReviewIdOnOneReviewImage(
        reviewRequestDto.Image[0],
        review,
      );
      if (beforeImage) this.deleteOneReviewImage(beforeImage);
    }
  }

  async distinguishReviewVideosCountForModify(
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      const beforeVideos =
        await this.mediaGeneralRepository.findBeforeReviewVideos(review.id);
      await this.insertReviewIdOnMoreThenTwoReviewVideo(
        reviewRequestDto.Video,
        review,
      );
      if (beforeVideos.length >= 1) {
        await this.deleteMoreThenTwoReviewVideo(beforeVideos);
      }
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.insertReviewIdOnOneReviewVideo(
        reviewRequestDto.Video[0],
        review,
      );
      if (beforeVideo) await this.deleteOneReviewVideo(beforeVideo);
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
