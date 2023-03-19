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
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    reviewImgCookies.forEach(async (reviewImgCookie) => {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookie.url,
      );
      reviewRequestDto.Image = [...reviewRequestDto.Image, image];
    });
  }

  async pushOneReviewImageInDto(
    reviewImgCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
      reviewImgCookies[0].url,
    );
    reviewRequestDto.Image = [...reviewRequestDto.Image, image];
  }

  async pushMoreThenTwoReviewVideoInDto(
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    reviewVdoCookies.forEach(async (reviewVdoCookie) => {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookie.url,
      );
      reviewRequestDto.Video = [...reviewRequestDto.Video, video];
    });
  }

  async pushOneReviewVideoInDto(
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
    const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
      reviewVdoCookies[0].url,
    );
    reviewRequestDto.Video = [...reviewRequestDto.Video, video];
  }

  async insertReviewIdOnMoreThenTwoReviewImage(
    reviewImages: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    reviewImages.forEach(async (reviewImage) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewImage(
        reviewImage,
        review,
      );
    });
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
    reviewVideos.forEach(async (reviewVideo) => {
      await this.mediaInsertRepository.insertReviewIdOnReviewVideo(
        reviewVideo,
        review,
      );
    });
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
    beforeReviewImages.forEach(async (beforeReviewImage) => {
      await this.mediaGeneralRepository.deleteReviewImageWithId(
        beforeReviewImage.id,
      );
    });
  }

  async deleteOneReviewImage(beforeReviewImage: ReviewImageEntity) {
    await this.mediaGeneralRepository.deleteReviewImageWithId(
      beforeReviewImage.id,
    );
  }

  async deleteMoreThenTwoReviewVideo(beforeReviewVideos: ReviewVideoEntity[]) {
    beforeReviewVideos.forEach(async (beforeReviewVideo) => {
      await this.mediaGeneralRepository.deleteReviewVideoWithId(
        beforeReviewVideo.id,
      );
    });
  }

  async deleteOneReviewVideo(beforeReviewVideo: ReviewVideoEntity) {
    await this.mediaGeneralRepository.deleteReviewVideoWithId(
      beforeReviewVideo.id,
    );
  }

  async distinguishReviewImagesCountForPush(
    reviewImgCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
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
    reviewVdoCookies: RequestMediaDto[],
    reviewRequestDto: ReviewRequestDto,
  ): Promise<void> {
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
      await this.pushMoreThenTwoReviewImageInDto(
        reviewImgCookies,
        reviewRequestDto,
      );
      await Promise.all([
        this.insertReviewIdOnMoreThenTwoReviewImage(
          reviewRequestDto.Image,
          review,
        ),
        this.deleteMoreThenTwoReviewImage(beforeImages),
      ]);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.pushOneReviewImageInDto(reviewImgCookies, reviewRequestDto);
      await Promise.all([
        this.insertReviewIdOnOneReviewImage(reviewRequestDto.Image[0], review),
        this.deleteOneReviewImage(beforeImage),
      ]);
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
      await this.pushMoreThenTwoReviewVideoInDto(
        reviewVdoCookies,
        reviewRequestDto,
      );
      await Promise.all([
        this.insertReviewIdOnMoreThenTwoReviewVideo(
          reviewRequestDto.Video,
          review,
        ),
        this.deleteMoreThenTwoReviewVideo(beforeVideos),
      ]);
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.pushOneReviewVideoInDto(reviewVdoCookies, reviewRequestDto);
      await Promise.all([
        this.insertReviewIdOnOneReviewVideo(reviewRequestDto.Video[0], review),
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
