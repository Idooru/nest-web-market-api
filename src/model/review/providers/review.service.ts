import { Functions } from "src/model/etc/providers/functions";
import { ProductRepository } from "../../product/providers/product.repository";
import { UserRepository } from "../../user/providers/user.repository";
import { ReviewRepository } from "./review.repository";
import { Injectable } from "@nestjs/common";
import { CreateReviewServiceDto } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { RatingReposiotry } from "./rating.repository";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly ratingRepository: RatingReposiotry,
    private readonly functions: Functions,
  ) {}

  async putStarRating(
    userSelectScore: number,
    productName: string,
  ): Promise<string> {
    const promise1 = await Promise.allSettled([
      this.productRepository.findProductOneByName(productName),
      this.ratingRepository.createRating(),
    ]);

    const promise1Result = this.functions.promiseSettledProcess(
      promise1,
      "find product and create rating",
    );

    const [product, rating] = promise1Result.map((idx) => idx.value);
    const productId = product.id;

    const promise2 = await Promise.allSettled([
      this.ratingRepository.ratingIncreaseAndSum(rating, userSelectScore),
      this.productRepository.insertRatingOnProduct(productId, rating),
    ]);

    this.functions.promiseSettledProcess(
      promise2,
      "rating Increase, sum and insert on product",
    );

    return rating;
  }

  async calculateRating(ratingId: string) {
    console.log(1);
  }

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
    // const ratingRatio = (rating + product.rating) / product.ratingCount / 5;
    // await this.productRepository.updateRating(product, ratingRatio);
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
