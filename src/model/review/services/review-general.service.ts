import { CreateReviewDto } from "../dto/create-review.dto";
import { ReviewGeneralRepository } from "../repositories/review-general.repository";
import { Injectable } from "@nestjs/common";
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

  async createReview(createReviewDto: CreateReviewDto): Promise<ReviewEntity> {
    const { reviewRequestDto, jwtPayload, productId } = createReviewDto;

    const [product, client] = await Promise.all([
      this.productGeneralRepository.findProductOneById(productId),
      this.userGeneralRepository.findClientUserObjectWithId(jwtPayload.userId),
    ]);

    await this.reviewGeneralRepository.createReview({
      reviewRequestDto,
      client,
      product,
    });

    const review = await this.reviewInsertRepository.findLastCreatedReview();
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
