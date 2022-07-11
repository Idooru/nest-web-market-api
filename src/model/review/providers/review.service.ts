import { Promises } from "../../../common/config/etc/providers/promises";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable } from "@nestjs/common";
import {
  CreateReviewWithImageAndVideoDao,
  CreateReviewWithoutMediaDao,
  CreateReviewWithImage,
  CreateReviewWithVideo,
} from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
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

  async CreateReviewWithVideo(
    createReviewDao: CreateReviewWithVideo,
  ): Promise<void> {}

  async createReviewWithoutMedia(
    createReviewDao: CreateReviewWithoutMediaDao,
  ): Promise<void> {}
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
