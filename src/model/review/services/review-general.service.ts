import { ModifyReviewWithImageAndVideoDto } from "../dto/modify-review.dto";
import {
  CreateReviewWithImageAndVideoDto,
  CreateReviewWithoutMediaDto,
  CreateReviewWithImageDto,
  CreateReviewWithVideoDto,
  CreateReviewDto,
} from "../dto/create-review.dto";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import {
  ModifyReviewDto,
  ModifyReviewDao,
  ModifyReviewWithImageDto,
  ModifyReviewWithVideoDto,
} from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { UploadGeneralRepository } from "src/model/upload/repositories/upload-general.repository";
import { MediaUrlCookieValue } from "src/model/upload/media.url.cookies.interface";
import { ReviewImageEntity } from "src/model/upload/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/upload/entities/review.video.entity";

@Injectable()
export class ReviewGeneralService {
  constructor(
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly uploadGeneralRepository: UploadGeneralRepository,
  ) {}

  async findUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<[UserEntity, ProductEntity]> {
    return await Promise.all([
      this.userGeneralRepository.findUserWithId(userId),
      this.productGeneralRepository.findProductOneById(productId),
    ]);
  }

  async distinguishOwnReview(
    reviewId: string,
    userId: string,
  ): Promise<ReviewEntity> {
    const { Activity } = await this.userGeneralRepository.findUserWithId(
      userId,
    );

    const reviews =
      await this.reviewGeneralRepository.findAllReviewsWithUserActivity(
        Activity,
      );

    const review = reviews.find((idx) => idx.id === reviewId);

    if (!review) {
      // 만약 리뷰를 하나도 작성하지 않은 사용자가 다른 사용자의 리뷰를 수정하려고 시도할시 아래 예외가 발생한다.
      throw new NotFoundException(
        `해당 activityId(${userId})로 작성된 리뷰중에 reviewId(${reviewId})와 같은 리뷰를 찾을 수 없습니다.`,
      );
    }

    return review;
  }

  async findReviewImageMore(
    reviewImgCookies: MediaUrlCookieValue[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    for (const reviewImgCookie of reviewImgCookies) {
      const image = await this.uploadGeneralRepository.findReviewImageWithUrl(
        reviewImgCookie.url,
      );
      reviewDto.Image.push(image);
    }
  }

  async findReviewImageOne(
    reviewImgCookies: MediaUrlCookieValue[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    const image = await this.uploadGeneralRepository.findReviewImageWithUrl(
      reviewImgCookies[0].url,
    );
    reviewDto.Image.push(image);
  }

  async findReviewVideoMore(
    reviewVdoCookies: MediaUrlCookieValue[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    for (const reviewVdoCookie of reviewVdoCookies) {
      const video = await this.uploadGeneralRepository.findReviewVideoWithUrl(
        reviewVdoCookie.url,
      );
      reviewDto.Video.push(video);
    }
  }

  async findReviewVideoOne(
    reviewVdoCookies: MediaUrlCookieValue[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    const video = await this.uploadGeneralRepository.findReviewVideoWithUrl(
      reviewVdoCookies[0].url,
    );
    reviewDto.Video.push(video);
  }

  async insertReviewIdOnReviewImageMore(
    images: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    for (const image of images) {
      await this.uploadGeneralRepository.insertReviewIdOnReviewImage(
        image,
        review,
      );
    }
  }

  async insertReviewIdOnReviewImageOne(
    image: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.uploadGeneralRepository.insertReviewIdOnReviewImage(
      image,
      review,
    );
  }

  async insertReviewIdOnReviewVideoMore(
    videos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    for (const video of videos) {
      await this.uploadGeneralRepository.insertReviewIdOnReviewVideo(
        video,
        review,
      );
    }
  }
  async insertReviewIdOnReviewVideoOne(
    video: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.uploadGeneralRepository.insertReviewIdOnReviewVideo(
      video,
      review,
    );
  }
  async createReviewWithImageAndVideo(
    createReviewWithImageAndVideoDto: CreateReviewWithImageAndVideoDto,
  ): Promise<void> {
    const {
      createReviewDto,
      jwtPayload,
      productId,
      reviewImgCookies,
      reviewVdoCookies,
    } = createReviewWithImageAndVideoDto;
    const { userId } = jwtPayload;
    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Image = [];
    createReviewDto.Video = [];

    if (reviewImgCookies.length >= 2) {
      this.findReviewImageMore(reviewImgCookies, createReviewDto);
    } else {
      this.findReviewImageOne(reviewImgCookies, createReviewDto);
    }

    if (reviewVdoCookies.length >= 2) {
      this.findReviewVideoMore(reviewVdoCookies, createReviewDto);
    } else {
      this.findReviewVideoOne(reviewVdoCookies, createReviewDto);
    }

    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      user,
      product,
    });

    await this.userGeneralRepository.increaseReviewCount(user);

    const review = await this.reviewGeneralRepository.findLastCreatedReview();

    await this.reviewGeneralRepository.insertReviewIdOnUserActivity(
      user.Activity,
      review,
    );

    if (reviewImgCookies.length >= 2) {
      this.insertReviewIdOnReviewImageMore(createReviewDto.Image, review);
    } else {
      this.insertReviewIdOnReviewImageOne(createReviewDto.Image[0], review);
    }

    if (reviewVdoCookies.length >= 2) {
      this.insertReviewIdOnReviewVideoMore(createReviewDto.Video, review);
    } else {
      this.insertReviewIdOnReviewVideoOne(createReviewDto.Video[0], review);
    }
  }

  async createReviewWithImage(
    createRevieWithImageDto: CreateReviewWithImageDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewImgCookies } =
      createRevieWithImageDto;
    const { userId } = jwtPayload;
    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Image = [];

    if (reviewImgCookies.length >= 2) {
      this.findReviewImageMore(reviewImgCookies, createReviewDto);
    } else {
      this.findReviewImageOne(reviewImgCookies, createReviewDto);
    }

    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      user,
      product,
    });

    await this.userGeneralRepository.increaseReviewCount(user);

    const review = await this.reviewGeneralRepository.findLastCreatedReview();

    await this.reviewGeneralRepository.insertReviewIdOnUserActivity(
      user.Activity,
      review,
    );

    if (reviewImgCookies.length >= 2) {
      this.insertReviewIdOnReviewImageMore(createReviewDto.Image, review);
    } else {
      this.insertReviewIdOnReviewImageOne(createReviewDto.Image[0], review);
    }
  }

  async createReviewWithVideo(
    createReviewWithVideoDto: CreateReviewWithVideoDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewVdoCookies } =
      createReviewWithVideoDto;
    const { userId } = jwtPayload;
    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Video = [];

    if (reviewVdoCookies.length >= 2) {
      this.findReviewVideoMore(reviewVdoCookies, createReviewDto);
    } else {
      this.findReviewVideoOne(reviewVdoCookies, createReviewDto);
    }

    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      user,
      product,
    });

    await this.userGeneralRepository.increaseReviewCount(user);

    const review = await this.reviewGeneralRepository.findLastCreatedReview();

    await this.reviewGeneralRepository.insertReviewIdOnUserActivity(
      user.Activity,
      review,
    );

    if (reviewVdoCookies.length >= 2) {
      this.insertReviewIdOnReviewVideoMore(createReviewDto.Video, review);
    } else {
      this.insertReviewIdOnReviewVideoOne(createReviewDto.Video[0], review);
    }
  }

  async createReviewWithoutMedia(
    createReviewWithOutMediaDto: CreateReviewWithoutMediaDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId } =
      createReviewWithOutMediaDto;
    const { userId } = jwtPayload;
    const [user, product] = await this.findUserAndProduct(userId, productId);

    await this.reviewGeneralRepository.createReview({
      createReviewDto,
      user,
      product,
    });

    await this.userGeneralRepository.increaseReviewCount(user);

    const review = await this.reviewGeneralRepository.findLastCreatedReview();

    await this.reviewGeneralRepository.insertReviewIdOnUserActivity(
      user.Activity,
      review,
    );
  }

  async modifyReviewWithImageAndVideo(
    modifyReviewWithImageAndVideoDto: ModifyReviewWithImageAndVideoDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewImgCookies, reviewVdoCookies } =
      modifyReviewWithImageAndVideoDto;
    modifyReviewDto.Image = [];
    modifyReviewDto.Video = [];

    if (reviewImgCookies.length >= 2) {
      this.findReviewImageMore(reviewImgCookies, modifyReviewDto);
    } else {
      this.findReviewImageOne(reviewImgCookies, modifyReviewDto);
    }

    if (reviewVdoCookies.length >= 2) {
      this.findReviewVideoMore(reviewVdoCookies, modifyReviewDto);
    } else {
      this.findReviewVideoOne(reviewVdoCookies, modifyReviewDto);
    }

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });
  }

  async modifyReviewWithImage(
    modifyReviewWithImageDto: ModifyReviewWithImageDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewImgCookies } =
      modifyReviewWithImageDto;
    modifyReviewDto.Image = [];

    if (reviewImgCookies.length >= 2) {
      this.findReviewImageMore(reviewImgCookies, modifyReviewDto);
    } else {
      this.findReviewImageOne(reviewImgCookies, modifyReviewDto);
    }

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });
  }

  async modifyReviewWithVideo(
    modifyReviewWithVideoDto: ModifyReviewWithVideoDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewVdoCookies } =
      modifyReviewWithVideoDto;
    modifyReviewDto.Video = [];

    if (reviewVdoCookies.length >= 2) {
      this.findReviewVideoMore(reviewVdoCookies, modifyReviewDto);
    } else {
      this.findReviewVideoOne(reviewVdoCookies, modifyReviewDto);
    }

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });
  }

  async modifyReviewWithoutMedia(
    modifyReviewDao: ModifyReviewDao,
  ): Promise<void> {
    await this.reviewGeneralRepository.modifyReview(modifyReviewDao);
  }
}
