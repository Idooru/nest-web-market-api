import { ModifyReviewWithImageAndVideoDto } from "./../dto/modify-review.dto";
import {
  CreateReviewWithImageAndVideoDto,
  CreateReviewWithoutMediaDto,
  CreateReviewWithImageDto,
  CreateReviewWithVideoDto,
  CreateReviewDto,
} from "../dto/create-review.dto";
import { ProductRepository } from "./../../product/providers/product.repository";
import { Promises } from "../../../common/config/etc/providers/promises";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UploadRepository } from "src/model/upload/providers/upload.repository";
import { StarRatingService } from "src/model/review/providers/star-rating.service";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import {
  ModifyReviewDto,
  ModifyReviewDao,
  ModifyReviewWithImageDto,
  ModifyReviewWithVideoDto,
} from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly starRatingService: StarRatingService,
    private readonly promises: Promises,
  ) {}

  async increaeStarRating(
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
    const findUserAndProduct = await Promise.allSettled([
      this.userRepository.findUserWithId(userId),
      this.productRepository.findProductOneById(productId),
    ]);

    return this.promises.twoPromiseSettled(
      findUserAndProduct[0],
      findUserAndProduct[1],
      "Find User And Product",
    );
  }

  async distinguishOwnReview(reviewId: string, userId: string) {
    const { Activity } = await this.userRepository.findUserWithId(userId);

    const reviews = await this.reviewRepository.findAllReviewsWithUserActivity(
      Activity,
    );

    const review = reviews.find((idx) => idx.id === reviewId);

    if (!review) {
      throw new NotFoundException(
        `해당 id(${reviewId})로 작성된 리뷰가 없습니다.`,
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
      reviewImgCookie,
      reviewVdoCookie,
    } = createReviewDao;
    const { userId } = jwtPayload;

    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Image = [];
    createReviewDto.Video = [];

    if (reviewImgCookie.length >= 2) {
      for (const idx of reviewImgCookie) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        createReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookie[0][1],
      );
      createReviewDto.Image.push(image);
    }

    if (reviewVdoCookie.length >= 2) {
      for (const idx of reviewVdoCookie) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );
        createReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookie[0][1],
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
    const { createReviewDto, jwtPayload, productId, reviewImgCookie } =
      createReviewDao;
    const { userId } = jwtPayload;
    createReviewDto.Image = [];

    const [user, product] = await this.findUserAndProduct(userId, productId);

    if (reviewImgCookie.length >= 2) {
      for (const idx of reviewImgCookie) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        createReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookie[0][1],
      );

      createReviewDto.Image.push(image);
    }

    await this.reviewRepository.createReviewWithImage({
      createReviewDto,
      user,
      product,
    });

    await this.userRepository.increaseReviewCount(user);
  }

  async createReviewWithVideo(
    createReviewDao: CreateReviewWithVideoDto,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewVdoCookie } =
      createReviewDao;
    const { userId } = jwtPayload;
    const [user, product] = await this.findUserAndProduct(userId, productId);
    createReviewDto.Video = [];

    if (reviewVdoCookie.length >= 2) {
      for (const idx of reviewVdoCookie) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );

        createReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookie[0][1],
      );

      createReviewDto.Video.push(video);
    }

    await this.reviewRepository.createReviewWithVideo({
      createReviewDto,
      user,
      product,
    });

    await this.userRepository.increaseReviewCount(user);
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
    await this.userRepository.increaseReviewCount(user);
  }

  async modifyReviewWithImageAndVideo(
    ModifyReviewWithImageAndVideoDto: ModifyReviewWithImageAndVideoDto,
  ): Promise<void> {
    const { modifyReviewDto, review, reviewImgCookie, reviewVdoCookie } =
      ModifyReviewWithImageAndVideoDto;

    if (reviewImgCookie.length >= 2) {
      for (const idx of reviewImgCookie) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );

        modifyReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookie[0][1],
      );

      modifyReviewDto.Image.push(image);
    }

    if (reviewVdoCookie.length >= 2) {
      for (const idx of reviewVdoCookie) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );

        modifyReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookie[0][1],
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
    const { modifyReviewDto, review, reviewImgCookie } =
      modifyReviewWithImageDto;

    if (reviewImgCookie.length >= 2) {
      for (const idx of reviewImgCookie) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );

        modifyReviewDto.Image.push(image);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookie[0][1],
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
    const { modifyReviewDto, review, reviewVdoCookie } =
      modifyReviewWithVideoDto;

    if (reviewVdoCookie.length >= 2) {
      for (const idx of reviewVdoCookie) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );

        modifyReviewDto.Video.push(video);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookie[0][1],
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

// findAll() {
//   return `This action returns all review`;
// }

// findOne(id: number) {
//   return `This action returns a #${id} review`;
// }

// update(id: number, updateReviewDto: UpdateReviewDto) {
//   return `This action updates a #${id} review`;
// }

// remove(id: number) {
//   return `This action removes a #${id} review`;
// }

// async createReviewWithImage(
//   createReviewDao: CreateReviewWithImageDto,
// ): Promise<void> {
//   const { createReviewDto, jwtPayload, productId, reviewImgCookie } =
//     createReviewDao;
//   const { userId } = jwtPayload;

//   const user = await this.userRepository.findUserWithId(id);
//   const product = await this.productRepository.findProductOneByName(
//     productName,
//   );

//   const review = await this.reviewRepository.createReviewWithoutMedia(
//     createReviewDto,
//     user,
//     product,
//   );

//   if (reviewImgCookie.length >= 2) {
//     for (const idx of reviewImgCookie) {
//       const image = await this.uploadRepository.findReviewImageWithUrl(
//         idx[1],
//       );
//       await this.uploadRepository.insertImageOnReview(image.id, review);
//     }
//   } else {
//     const image = await this.uploadRepository.findReviewImageWithUrl(
//       reviewImgCookie[0][1],
//     );
//     await this.uploadRepository.insertImageOnReview(image.id, review);
//   }

//   await this.userRepository.increaseReviewCount(user);
// }
