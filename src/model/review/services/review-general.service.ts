import { CreateReviewDto } from "../dto/create-review.dto";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ModifyReviewDto } from "../dto/modify-review.dto";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { UserGeneralRepository } from "src/model/user/repositories/user-general.repository";
import { ReviewInsertRepository } from "../repositories/review-insert.repository";

@Injectable()
export class ReviewGeneralService {
  constructor(
    private readonly reviewGeneralRepository: ReviewGeneralRepository,
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly userGeneralRepository: UserGeneralRepository,
    private readonly reviewInsertRepository: ReviewInsertRepository,
  ) {}

  async findReviewFromProductById(id: string): Promise<ReviewEntity[]> {
    const product = await this.productGeneralRepository.findOneProductById(id);

    if (product.Review.length === 0) {
      throw new NotFoundException("해당 상품에 리뷰가 존재하지 않습니다.");
    }

    return product.Review;
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { reviewRequestDto, jwtPayload, productId } = createReviewDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findOneProductById(productId),
      this.userGeneralRepository.findClientUserObjectWithId(jwtPayload.userId),
    ]);

    const reviewOutput = await this.reviewGeneralRepository.createReview({
      reviewRequestDto,
      client,
      product,
    });

    const reviewId = reviewOutput.generatedMaps[0].id;

    const review = await this.reviewInsertRepository.findOneReviewById(
      reviewId,
    );

    await this.reviewInsertRepository.insertReviewIdOnClientUser(
      client,
      review,
    );

    return review;
  }

  async modifyReview(modifyReviewDto: ModifyReviewDto): Promise<void> {
    await this.reviewGeneralRepository.modifyReview(modifyReviewDto);
  }

  async deleteReview(review: ReviewEntity): Promise<void> {
    await this.reviewGeneralRepository.deleteReview(review);
  }
}
