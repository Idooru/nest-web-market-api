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
import { MediaGeneralRepository } from "src/model/media/repositories/media-general.repository";
import { ReviewImageEntity } from "src/model/media/entities/review.image.entity";
import { ReviewVideoEntity } from "src/model/media/entities/review.video.entity";
import { ReceiveMediaDto } from "src/model/media/dto/receive-media.dto";

@Injectable()
export class ReviewGeneralService {
  constructor(
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly mediaGeneralRepository: MediaGeneralRepository,
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
        `해당 activityId(${Activity.id})로 작성된 리뷰중에 reviewId(${reviewId})와 같은 리뷰를 찾을 수 없습니다.`,
      );
    }

    return review;
  }

  async findReviewImageMore(
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

  async findReviewImageOne(
    reviewImgCookies: ReceiveMediaDto[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    const image = await this.mediaGeneralRepository.findReviewImageWithUrl(
      reviewImgCookies[0].url,
    );
    reviewDto.Image.push(image);
  }

  async findReviewVideoMore(
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

  async findReviewVideoOne(
    reviewVdoCookies: ReceiveMediaDto[],
    reviewDto: CreateReviewDto | ModifyReviewDto,
  ): Promise<void> {
    const video = await this.mediaGeneralRepository.findReviewVideoWithUrl(
      reviewVdoCookies[0].url,
    );
    reviewDto.Video.push(video);
  }

  async insertReviewIdOnReviewImageMore(
    images: ReviewImageEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    for (const image of images) {
      await this.mediaGeneralRepository.insertReviewIdOnReviewImage(
        image,
        review,
      );
    }
  }

  async insertReviewIdOnReviewImageOne(
    image: ReviewImageEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.mediaGeneralRepository.insertReviewIdOnReviewImage(
      image,
      review,
    );
  }

  async insertReviewIdOnReviewVideoMore(
    videos: ReviewVideoEntity[],
    review: ReviewEntity,
  ): Promise<void> {
    for (const video of videos) {
      await this.mediaGeneralRepository.insertReviewIdOnReviewVideo(
        video,
        review,
      );
    }
  }

  async insertReviewIdOnReviewVideoOne(
    video: ReviewVideoEntity,
    review: ReviewEntity,
  ): Promise<void> {
    await this.mediaGeneralRepository.insertReviewIdOnReviewVideo(
      video,
      review,
    );
  }

  async deleteReviewImageMore(beforeImages: ReviewImageEntity[]) {
    for (const beforeImage of beforeImages) {
      await this.mediaGeneralRepository.deleteReviewImageWithId(beforeImage.id);
    }
  }

  async deleteReviewImageOne(beforeImage: ReviewImageEntity) {
    await this.mediaGeneralRepository.deleteReviewImageWithId(beforeImage.id);
  }

  async deleteReviewVideoMore(beforeVideos: ReviewVideoEntity[]) {
    for (const beforeVideo of beforeVideos) {
      await this.mediaGeneralRepository.deleteReviewVideoWithId(beforeVideo.id);
    }
  }

  async deleteReviewVideoOne(beforeVideo: ReviewVideoEntity) {
    await this.mediaGeneralRepository.deleteReviewVideoWithId(beforeVideo.id);
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
      await this.findReviewImageMore(reviewImgCookies, createReviewDto);
    } else {
      await this.findReviewImageOne(reviewImgCookies, createReviewDto);
    }

    if (reviewVdoCookies.length >= 2) {
      await this.findReviewVideoMore(reviewVdoCookies, createReviewDto);
    } else {
      await this.findReviewVideoOne(reviewVdoCookies, createReviewDto);
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
      await this.insertReviewIdOnReviewImageMore(createReviewDto.Image, review);
    } else {
      await this.insertReviewIdOnReviewImageOne(
        createReviewDto.Image[0],
        review,
      );
    }

    if (reviewVdoCookies.length >= 2) {
      await this.insertReviewIdOnReviewVideoMore(createReviewDto.Video, review);
    } else {
      await this.insertReviewIdOnReviewVideoOne(
        createReviewDto.Video[0],
        review,
      );
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
      await this.findReviewImageMore(reviewImgCookies, createReviewDto);
    } else {
      await this.findReviewImageOne(reviewImgCookies, createReviewDto);
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
      await this.insertReviewIdOnReviewImageMore(createReviewDto.Image, review);
    } else {
      await this.insertReviewIdOnReviewImageOne(
        createReviewDto.Image[0],
        review,
      );
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
      await this.findReviewVideoMore(reviewVdoCookies, createReviewDto);
    } else {
      await this.findReviewVideoOne(reviewVdoCookies, createReviewDto);
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
      await this.insertReviewIdOnReviewVideoMore(createReviewDto.Video, review);
    } else {
      await this.insertReviewIdOnReviewVideoOne(
        createReviewDto.Video[0],
        review,
      );
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

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });

    modifyReviewDto.Image = [];
    modifyReviewDto.Video = [];

    if (reviewImgCookies.length >= 2) {
      const beforeImages =
        await this.mediaGeneralRepository.findBeforeReviewImages(review.id);
      await this.findReviewImageMore(reviewImgCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewImageMore(modifyReviewDto.Image, review),
        this.deleteReviewImageMore(beforeImages),
      ]);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.findReviewImageOne(reviewImgCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewImageOne(modifyReviewDto.Image[0], review),
        this.deleteReviewImageOne(beforeImage),
      ]);
    }

    if (reviewVdoCookies.length >= 2) {
      const beforeVideos =
        await this.mediaGeneralRepository.findBeforeReviewVideos(review.id);

      await this.findReviewVideoMore(reviewVdoCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewVideoMore(modifyReviewDto.Video, review),
        this.deleteReviewVideoMore(beforeVideos),
      ]);
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.findReviewVideoOne(reviewVdoCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewVideoOne(modifyReviewDto.Video[0], review),
        this.deleteReviewVideoOne(beforeVideo),
      ]);
    }
  }

  async modifyReviewWithImage(
    modifyReviewWithImageDto: ModifyReviewWithImageDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewImgCookies } =
      modifyReviewWithImageDto;

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });

    modifyReviewDto.Image = [];

    if (reviewImgCookies.length >= 2) {
      const beforeImages =
        await this.mediaGeneralRepository.findBeforeReviewImages(review.id);
      await this.findReviewImageMore(reviewImgCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewImageMore(modifyReviewDto.Image, review),
        this.deleteReviewImageMore(beforeImages),
      ]);
    } else {
      const beforeImage =
        await this.mediaGeneralRepository.findBeforeReviewImage(review.id);
      await this.findReviewImageOne(reviewImgCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewImageOne(modifyReviewDto.Image[0], review),
        this.deleteReviewImageOne(beforeImage),
      ]);
    }
  }

  async modifyReviewWithVideo(
    modifyReviewWithVideoDto: ModifyReviewWithVideoDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewVdoCookies } =
      modifyReviewWithVideoDto;

    await this.reviewGeneralRepository.modifyReview({
      modifyReviewDto,
      review,
    });

    modifyReviewDto.Video = [];

    if (reviewVdoCookies.length >= 2) {
      const beforeVideos =
        await this.mediaGeneralRepository.findBeforeReviewVideos(review.id);
      await this.findReviewVideoMore(reviewVdoCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewVideoMore(modifyReviewDto.Video, review),
        this.deleteReviewVideoMore(beforeVideos),
      ]);
    } else {
      const beforeVideo =
        await this.mediaGeneralRepository.findBeforeReviewVideo(review.id);
      await this.findReviewVideoOne(reviewVdoCookies, modifyReviewDto);
      await Promise.all([
        this.insertReviewIdOnReviewVideoOne(modifyReviewDto.Video[0], review),
        this.deleteReviewVideoOne(beforeVideo),
      ]);
    }
  }

  async modifyReviewWithoutMedia(
    modifyReviewDao: ModifyReviewDao,
  ): Promise<void> {
    await this.reviewGeneralRepository.modifyReview(modifyReviewDao);
  }

  async deleteReview(review: ReviewEntity, userId: string): Promise<void> {
    const user = await this.userGeneralRepository.findUserWithId(userId);

    await Promise.all([
      this.reviewGeneralRepository.deleteReview(review),
      this.userGeneralRepository.decreaseReviewCount(user),
    ]);
  }
}