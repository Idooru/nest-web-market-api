import { ModifyReviewWithImageAndVideoDto } from "../dto/modify-review.dto";
import {
  CreateReviewWithImageAndVideoDto,
  CreateReviewWithoutMediaDto,
  CreateReviewWithImageDto,
  CreateReviewWithVideoDto,
  CreateReviewDto,
} from "../dto/create-review.dto";
import { ReviewRepository } from "../repositories/review.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { StarRatingService } from "src/model/review/services/star-rating.service";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import {
  ModifyReviewDto,
  ModifyReviewDao,
  ModifyReviewWithImageDto,
  ModifyReviewWithVideoDto,
} from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { UploadRepository } from "src/model/upload/repositories/upload.repository";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly starRatingService: StarRatingService,
    private readonly promiseLibrary: PromiseLibrary,
  ) {}

  async increaseStarRating(
    createReviewDto: CreateReviewDto,
    productId: string,
  ): Promise<void> {
    const { userSelectScore } = createReviewDto;
    const starRating = await this.starRatingService.increateStarRating(
      userSelectScore,
      productId,
    );
    await this.starRatingService.calculateRating(starRating);
  }

  async modifyStarRating(
    modifyReviewDto: ModifyReviewDto,
    productId: string,
    review: ReviewEntity,
  ): Promise<void> {
    const { userSelectScore } = modifyReviewDto;

    const starRating = await this.starRatingService.modifyStarRating(
      userSelectScore,
      productId,
      review,
    );
    await this.starRatingService.calculateRating(starRating);
  }

  async findUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<[UserEntity, ProductEntity]> {
    return await this.promiseLibrary.twoPromiseBundle(
      this.userGeneralRepository.findUserWithId(userId),
      this.productGeneralRepository.findProductOneById(productId),
      "Find User And Product",
    );
  }

  async distinguishOwnReview(reviewId: string, userId: string) {
    const { Activity } = await this.userGeneralRepository.findUserWithId(
      userId,
    );

    const reviews = await this.reviewRepository.findAllReviewsWithUserActivity(
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

  async createReviewWithImageAndVideo(
    createReviewDao: CreateReviewWithImageAndVideoDto,
  ): Promise<any> {
    const {
      createReviewDto,
      jwtPayload,
      productId,
      reviewImgCookies,
      reviewVdoCookies,
    } = createReviewDao;
    const { userId } = jwtPayload;

    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Image = [];
    createReviewDto.Video = [];

    if (reviewImgCookies.length >= 2) {
      for (const idx of reviewImgCookies) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        createReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookies[0][1],
      );
      createReviewDto.Image.push(image);
    }

    if (reviewVdoCookies.length >= 2) {
      for (const idx of reviewVdoCookies) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );
        createReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookies[0][1],
      );
      createReviewDto.Video.push(video);
    }

    await this.reviewRepository.createReviewWithImageAndVideo({
      createReviewDto,
      user,
      product,
    });
  }

  async createReviewWithImage(
    createReviewDao: CreateReviewWithImageDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewImgCookies } =
      createReviewDao;
    const { userId } = jwtPayload;
    createReviewDto.Image = [];

    const [user, product] = await this.findUserAndProduct(userId, productId);

    if (reviewImgCookies.length >= 2) {
      for (const idx of reviewImgCookies) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        createReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookies[0][1],
      );
      createReviewDto.Image.push(image);
    }

    await this.reviewRepository.createReviewWithImage({
      createReviewDto,
      user,
      product,
    });

    await this.userGeneralRepository.increaseReviewCount(user);
  }

  async createReviewWithVideo(
    createReviewDao: CreateReviewWithVideoDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewVdoCookies } =
      createReviewDao;
    const { userId } = jwtPayload;
    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Video = [];

    if (reviewVdoCookies.length >= 2) {
      for (const idx of reviewVdoCookies) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );
        createReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookies[0][1],
      );
      createReviewDto.Video.push(video);
    }

    await this.reviewRepository.createReviewWithVideo({
      createReviewDto,
      user,
      product,
    });

    await this.userGeneralRepository.increaseReviewCount(user);
  }

  async createReviewWithoutMedia(
    createReviewDao: CreateReviewWithoutMediaDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId } = createReviewDao;
    const { userId } = jwtPayload;

    const [user, product] = await this.findUserAndProduct(userId, productId);

    await this.reviewRepository.createReviewWithoutMedia({
      createReviewDto,
      user,
      product,
    });
    await this.userGeneralRepository.increaseReviewCount(user);
  }

  async modifyReviewWithImageAndVideo(
    modifyReviewWithImageAndVideoDto: ModifyReviewWithImageAndVideoDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewImgCookies, reviewVdoCookies } =
      modifyReviewWithImageAndVideoDto;
    modifyReviewDto.Image = [];
    modifyReviewDto.Video = [];

    if (reviewImgCookies.length >= 2) {
      for (const idx of reviewImgCookies) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        modifyReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookies[0][1],
      );
      modifyReviewDto.Image.push(image);
    }

    if (reviewVdoCookies.length >= 2) {
      for (const idx of reviewVdoCookies) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );
        modifyReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookies[0][1],
      );
      modifyReviewDto.Video.push(video);
    }

    await this.reviewRepository.modifyReviewWithImageAndVideo({
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
      for (const idx of reviewImgCookies) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        modifyReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookies[0][1],
      );
      modifyReviewDto.Image.push(image);
    }

    await this.reviewRepository.modifyReviewWithImage({
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
      for (const idx of reviewVdoCookies) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );
        modifyReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookies[0][1],
      );
      modifyReviewDto.Video.push(video);
    }

    await this.reviewRepository.modifyReviewWithVideo({
      modifyReviewDto,
      review,
    });
  }

  async modifyReviewWithoutMedia(
    modifyReviewDao: ModifyReviewDao,
  ): Promise<void> {
    await this.reviewRepository.modifyReviewWithoutMedia(modifyReviewDao);
  }
}
