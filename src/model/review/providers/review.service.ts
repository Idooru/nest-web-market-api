import { StarRatingEntity } from "./../entities/star-rating.entity";
import { Promises } from "../../../common/config/etc/providers/promises";
import { ProductRepository } from "../../product/providers/product.repository";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable } from "@nestjs/common";
import { CreateReviewServiceDto } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { StarRatingRepository } from "./star-rating.repository";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly starRatingRepository: StarRatingRepository,
    private readonly promises: Promises,
  ) {}

  async putStarRating(
    userSelectScore: number,
    productName: string,
  ): Promise<StarRatingEntity> {
    const product =
      await this.productRepository.findProductWhenUseStarRatingWithName(
        productName,
      );

    const productId = product.id;
    const starRatingId = product.starRating.id;
    const starRating = await this.starRatingRepository.findStarRatingWithId(
      starRatingId,
    );

    const promise = await Promise.allSettled([
      this.starRatingRepository.starRatingIncreaseAndSum(
        starRating,
        userSelectScore,
      ),
      this.productRepository.insertStarRatingOnProduct(productId, starRating),
    ]);
    this.promises.twoPromiseSettled(
      promise[0],
      promise[1],
      "starRating Increase, sum and insert on product",
    );
    return starRating;
  }

  async calculateRating(starRating: StarRatingEntity) {}

  async createReview(createReviewVo: CreateReviewServiceDto): Promise<any> {
    // const { createReviewDto, jwtPayload, productName, reviewImg, reviewVdo } =
    //   createReviewVo;
    // const { comments, userSelectScore } = createReviewDto;
    // const { nickname } = jwtPayload;
    // const user = await this.userRepository.findUserWithNickName(nickname);
    // const product = await this.productRepository.findProductOneByName(
    //   productName,
    // );
    // await this.productRepository.increaseReviewCount(product);
    // const starRatingRatio = (starRating + product.starRating) / product.starRatingCount / 5;
    // await this.productRepository.updateRating(product, starRatingRatio);
    // return;
    // if (reviewImg && reviewVdo) {
    //   return await this.reviewRepository.createReview(createReviewVo);
    // } else if (reviewImg) {
    //   return await this.reviewRepository.createReview({ createReviewDto });
    // } else if (reviewVdo) {
    // } else {
    // }
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
