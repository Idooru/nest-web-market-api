import {
  CreateReviewWithImageAndVideoDao,
  CreateReviewWithoutMediaDao,
  CreateReviewWithImageDao,
  CreateReviewWithVideoDao,
} from "../dto/create-review.dto";
import { ProductRepository } from "./../../product/providers/product.repository";
import { Promises } from "../../../common/config/etc/providers/promises";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable } from "@nestjs/common";
import { ReviewsEntity } from "../entities/review.entity";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { UploadRepository } from "src/model/upload/providers/upload.repository";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly promises: Promises,
  ) {}

  async createReviewWithImageAndVideo(
    createReviewDao: CreateReviewWithImageAndVideoDao,
  ): Promise<any> {
    const {
      createReviewDto,
      jwtPayload,
      productName,
      reviewImgCookie,
      reviewVdoCookie,
    } = createReviewDao;
    const { nickname } = jwtPayload;

    const user = await this.userRepository.findUserWithNickName(nickname);
    const product = await this.productRepository.findProductOneByName(
      productName,
    );

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
    const { createReviewDto, jwtPayload, productName, reviewImgCookie } =
      createReviewDao;
    const { id } = jwtPayload;

    const user = await this.userRepository.findUserWithId(id);
    const product = await this.productRepository.findProductOneByName(
      productName,
    );

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

    await this.userRepository.increaseReviewCount(user);
  }

  async createReviewWithVideo(
    createReviewDao: CreateReviewWithVideoDao,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productName, reviewVdoCookie } =
      createReviewDao;
    const { id } = jwtPayload;

    const user = await this.userRepository.findUserWithId(id);
    const product = await this.productRepository.findProductOneByName(
      productName,
    );

    const review = await this.reviewRepository.createReview(
      createReviewDto,
      user,
      product,
    );

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

  async createReviewWithoutMedia(
    createReviewDao: CreateReviewWithoutMediaDao,
  ): Promise<void> {
    const { createReviewDto, jwtPayload, productName } = createReviewDao;
    const { id } = jwtPayload;

    const user = await this.userRepository.findUserWithId(id);
    const product = await this.productRepository.findProductOneByName(
      productName,
    );

    await this.reviewRepository.createReview(createReviewDto, user, product);
    await this.userRepository.increaseReviewCount(user);
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
