import { Injectable, NotFoundException } from "@nestjs/common";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { MediaInsertRepository } from "src/model/media/repositories/media-insert.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";

@Injectable()
export class ReviewRedundantService {
  constructor(
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
    private readonly mediaInsertRepository: MediaInsertRepository,
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

  async pushMoreThenTwoReviewImageInDto(
    reviewImgCookies: ReceiveMediaDto[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    for (const reviewImgCookie of reviewImgCookies) {
      const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
        reviewImgCookie.url,
      );
      reviewDto.Image.push(image);
    }
  }

  async pushOneReviewImageInDto(
    reviewImgCookies: ReceiveMediaDto[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
      reviewImgCookies[0].url,
    );
    reviewDto.Image.push(image);
  }

  async pushMoreThenTwoReviewVideoInDto(
    reviewVdoCookies: ReceiveMediaDto[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    for (const reviewVdoCookie of reviewVdoCookies) {
      const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookie.url,
      );
      reviewDto.Video.push(video);
    }
  }

  async pushOneReviewVideoInDto(
    reviewVdoCookies: ReceiveMediaDto[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
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
    reviewImgCookies: ReceiveMediaDto[],
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      await this.pushMoreThenTwoReviewImageInDto(
        reviewImgCookies,
        createReviewDto,
      );
    } else {
      await this.pushOneReviewImageInDto(reviewImgCookies, createReviewDto);
    }
  }

  async distinguishReviewVideosCountForPush(
    reviewVdoCookies: ReceiveMediaDto[],
    createReviewDto: CreateReviewDto,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      await this.pushMoreThenTwoReviewVideoInDto(
        reviewVdoCookies,
        createReviewDto,
      );
    } else {
      await this.pushOneReviewVideoInDto(reviewVdoCookies, createReviewDto);
    }
  }

  async distinguishReviewImagesCountForInsert(
    reviewImgCookies: ReceiveMediaDto[],
    createReviewDto: CreateReviewDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      await this.insertReviewIdOnMoreThenTwoReviewImage(
        createReviewDto.Image,
        review,
      );
    } else {
      await this.insertReviewIdOnOneReviewImage(
        createReviewDto.Image[0],
        review,
      );
    }
  }

  async distinguishReviewVideosCountForInsert(
    reviewVdoCookies: ReceiveMediaDto[],
    createReviewDto: CreateReviewDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      await this.insertReviewIdOnMoreThenTwoReviewVideo(
        createReviewDto.Video,
        review,
      );
    } else {
      await this.insertReviewIdOnOneReviewVideo(
        createReviewDto.Video[0],
        review,
      );
    }
  }

  async distinguishReviewImagesCountForModify(
    reviewImgCookies: ReceiveMediaDto[],
    modifyReviewDto: ModifyReviewDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewImgCookies.length >= 2) {
      const beforeImages =
        await this.mediaGeneralRepository.findBeforeReviewImages(review.id);
      await this.pushMoreThenTwoReviewImageInDto(
        reviewImgCookies,
        modifyReviewDto,
      );
      await Promise.all([
        this.insertReviewIdOnMoreThenTwoReviewImage(
          modifyReviewDto.Image,
          review,
        ),
        this.deleteMoreThenTwoReviewImage(beforeImages),
      ]);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.pushOneReviewImageInDto(reviewImgCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnOneReviewImage(modifyReviewDto.Image[0], review),
        this.deleteOneReviewImage(beforeImage),
      ]);
    }
  }

  async distinguishReviewVideosCountForModify(
    reviewVdoCookies: ReceiveMediaDto[],
    modifyReviewDto: ModifyReviewDto,
    review: ReviewEntity,
  ): Promise<void> {
    if (reviewVdoCookies.length >= 2) {
      const beforeVideos =
        await this.mediaGeneralRepository.findBeforeReviewVideos(review.id);
      await this.pushMoreThenTwoReviewVideoInDto(
        reviewVdoCookies,
        modifyReviewDto,
      );
      await Promise.all([
        this.insertReviewIdOnMoreThenTwoReviewVideo(
          modifyReviewDto.Video,
          review,
        ),
        this.deleteMoreThenTwoReviewVideo(beforeVideos),
      ]);
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.pushOneReviewVideoInDto(reviewVdoCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnOneReviewVideo(modifyReviewDto.Video[0], review),
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
