import {
  CreateReviewWithImageAndVideoDao,
  CreateReviewWithoutMediaDao,
  CreateReviewWithImageDao,
  CreateReviewWithVideoDao,
  CreateReviewDto,
} from "../dto/create-review.dto";
import { ProductRepository } from "./../../product/providers/product.repository";
import { Promises } from "../../../common/config/etc/providers/promises";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable } from "@nestjs/common";
import { UploadRepository } from "src/model/upload/providers/upload.repository";
import { StarRatingService } from "src/model/review/providers/star-rating.service";
import { UserEntity } from "src/model/user/entities/user.entity";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ModifyReviewDto } from "../dto/modify-review.dto";

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

  async starRating(
    reviewDto: CreateReviewDto | ModifyReviewDto,
    productId: string,
  ) {
    const { userSelectScore } = reviewDto;
    const starRating = await this.starRatingService.putStarRating(
      userSelectScore,
      productId,
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

    const resultForUserAndProduct = this.promises.twoPromiseSettled(
      findUserAndProduct[0],
      findUserAndProduct[1],
      "Find User And Product",
    );

    return resultForUserAndProduct;
  }

  async selfAuthForModifyReview(reviewId: string, userId: string) {
    const { Activity } = await this.userRepository.findUserWithId(userId);

    const reviews = await this.reviewRepository.findAllReviewsWithUserActivity(
      Activity,
    );

    1;
  }

  async createReviewWithImageAndVideo(
    createReviewDao: CreateReviewWithImageAndVideoDao,
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

    const review = await this.reviewRepository.createReview(
      createReviewDto,
      user,
      product,
    );

    if (reviewImgCookie.length >= 2) {
      for (const idx of reviewImgCookie) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );
        await this.uploadRepository.insertImageOnReview(image.id, review);
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookie[0][1],
      );
      await this.uploadRepository.insertImageOnReview(image.id, review);
    }

    if (reviewVdoCookie.length >= 2) {
      for (const idx of reviewVdoCookie) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );
        await this.uploadRepository.insertVideoOnReview(video.id, review);
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookie[0][1],
      );
      await this.uploadRepository.insertVideoOnReview(video.id, review);
    }

    await this.userRepository.increaseReviewCount(user);
  }

  async createReviewWithImage(
    createReviewDao: CreateReviewWithImageDao,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewImgCookie } =
      createReviewDao;
    const { userId } = jwtPayload;

    const [user, product] = await this.findUserAndProduct(userId, productId);

    if (reviewImgCookie.length >= 2) {
      for (const idx of reviewImgCookie) {
        const image = await this.uploadRepository.findReviewImageWithUrl(
          idx[1],
        );

        createReviewDto.Image = [image];

        await this.reviewRepository.createReviewWithImage(
          createReviewDto,
          user,
          product,
        );
      }
    } else {
      const image = await this.uploadRepository.findReviewImageWithUrl(
        reviewImgCookie[0][1],
      );

      createReviewDto.Image = [image];

      await this.reviewRepository.createReviewWithImage(
        createReviewDto,
        user,
        product,
      );
    }

    await this.userRepository.increaseReviewCount(user);
  }

  async createReviewWithVideo(
    createReviewDao: CreateReviewWithVideoDao,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId, reviewVdoCookie } =
      createReviewDao;
    const { userId } = jwtPayload;

    const [user, product] = await this.findUserAndProduct(userId, productId);

    if (reviewVdoCookie.length >= 2) {
      for (const idx of reviewVdoCookie) {
        const video = await this.uploadRepository.findReviewVideoWithUrl(
          idx[1],
        );

        createReviewDto.Video = [video];

        await this.reviewRepository.createReviewWithVideo(
          createReviewDto,
          user,
          product,
        );
      }
    } else {
      const video = await this.uploadRepository.findReviewVideoWithUrl(
        reviewVdoCookie[0][1],
      );

      createReviewDto.Video = [video];

      await this.reviewRepository.createReviewWithVideo(
        createReviewDto,
        user,
        product,
      );
    }

    await this.userRepository.increaseReviewCount(user);
  }

  async createReviewWithoutMedia(
    createReviewDao: CreateReviewWithoutMediaDao,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productId } = createReviewDao;
    const { userId } = jwtPayload;

    const [user, product] = await this.findUserAndProduct(userId, productId);

    await this.reviewRepository.createReview(createReviewDto, user, product);
    await this.userRepository.increaseReviewCount(user);
  }

  async modifyReviewWithoutMedia() {}
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
//   createReviewDao: CreateReviewWithImageDao,
// ): Promise<void> {
//   const { createReviewDto, jwtPayload, productId, reviewImgCookie } =
//     createReviewDao;
//   const { userId } = jwtPayload;

//   const user = await this.userRepository.findUserWithId(id);
//   const product = await this.productRepository.findProductOneByName(
//     productName,
//   );

//   const review = await this.reviewRepository.createReview(
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
