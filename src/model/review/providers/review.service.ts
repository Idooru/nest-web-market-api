import {
  CreateReviewWithImageAndVideoDao,
  CreateReviewWithoutMediaDao,
  CreateReviewWithImage,
  CreateReviewWithVideo,
} from "../dto/create-review.dto";
import { ProductRepository } from "./../../product/providers/product.repository";
import { Promises } from "../../../common/config/etc/providers/promises";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable } from "@nestjs/common";
import { ReviewEntity } from "../entities/review.entity";
import { UpdateReviewDto } from "../dto/update-review.dto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly promises: Promises,
  ) {}

  async createReviewWithImageAndVideo(
    createReviewDao: CreateReviewWithImageAndVideoDao,
  ): Promise<any> {
    //   const { createReviewDto, jwtPayload, productName, reviewImg, reviewVdo } =
    //     createReviewVo;
    //   const { comments, userSelectScore } = createReviewDto;
    //   const { nickname } = jwtPayload;
    //   const user = await this.userRepository.findUserWithNickName(nickname);
    //   const product = await this.productRepository.findProductOneByName(
    //     productName,
    //   );
    //   await this.productRepository.increaseReviewCount(product);
    //   const starRatingRatio =
    //     (starRating + product.starRating) / product.starRatingCount / 5;
    //   await this.productRepository.updateRating(product, starRatingRatio);
    //   return;
    //   if (reviewImg && reviewVdo) {
    //     return await this.reviewRepository.createReview(createReviewVo);
    //   } else if (reviewImg) {
    //     return await this.reviewRepository.createReview({ createReviewDto });
    //   } else if (reviewVdo) {
    //   } else {
    //   }
    // }
  }

  async createReviewWithImage(
    createReviewDao: CreateReviewWithImage,
  ): Promise<void> {}

  async createReviewWithVideo(
    createReviewDao: CreateReviewWithVideo,
  ): Promise<void> {}

  async createReviewWithoutMedia(
    createReviewDao: CreateReviewWithoutMediaDao,
  ): Promise<ReviewEntity> {
    const { createReviewDto, jwtPayload, productName } = createReviewDao;
    const { id } = jwtPayload;

    const user = await this.userRepository.findUserWithId(id);
    const product = await this.productRepository.findProductOneByName(
      productName,
    );

    createReviewDto.Image = null;

    const a = await this.reviewRepository.createReviewWithoutMedia(
      createReviewDto,
      user,
      product,
    );

    return a;
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
