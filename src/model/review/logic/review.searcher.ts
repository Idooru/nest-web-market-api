import { Injectable, NotFoundException } from "@nestjs/common";
import { ReviewSearchRepository } from "../repositories/review-search.repository";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewEntity } from "../entities/review.entity";
import { ProductSearcher } from "../../product/logic/product.searcher";

@Injectable()
export class ReviewSearcher {
  constructor(
    private readonly reviewSearchRepository: ReviewSearchRepository,
    private readonly productSearcher: ProductSearcher,
  ) {}

  async findAllClientsReviews(id: string): Promise<ReviewEntity[]> {
    return await this.reviewSearchRepository.findAllClientsReviews(id);
  }

  async findStarRateWithId(id: string): Promise<StarRateEntity> {
    return await this.reviewSearchRepository.findStarRateWithId(id);
  }

  async findReviewsWithProductId(id: string): Promise<ReviewEntity[]> {
    const product = await this.productSearcher.findProductWithId(id);

    if (!product.Review.length)
      throw new NotFoundException("해당 상품에 리뷰가 존재하지 않습니다.");

    return product.Review;
  }
}
