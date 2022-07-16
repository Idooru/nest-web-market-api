import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../product/providers/product.repository";
import { StarRatingRepository } from "./star-rating.repository";
import { StarRatingEntity } from "./../entities/star-rating.entity";
import { ReviewRepository } from "./review.repository";
import { ProductEntity } from "src/model/product/entities/product.entity";

@Injectable()
export class StarRatingService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly starRatingRepository: StarRatingRepository,
  ) {}

  async putStarRating(
    userSelectScore: number,
    productName: string,
  ): Promise<StarRatingEntity> {
    const product =
      await this.productRepository.findProductWhenUseStarRatingWithName(
        productName,
      );
    const starRatingId = product.StarRating.id;
    const starRating = await this.starRatingRepository.findStarRatingWithId(
      starRatingId,
    );
    this.starRatingRepository.starRatingIncreaseAndSum(
      starRating,
      userSelectScore,
    );
    return starRating;
  }

  async calculateRating(starRating: StarRatingEntity): Promise<void> {
    const starRatingProperty = Object.entries(starRating);
    const pointSum = [];
    const pointCount = [];

    for (const idx of starRatingProperty) {
      if (idx[0].includes("PointSum")) {
        pointSum.push(idx);
      }

      if (idx[0].includes("PointCount")) {
        pointCount.push(idx);
      }

      continue;
    }

    let countSum = 0;
    let scoreSum = 0;

    for (let i = 0; i < pointSum.length; i++) {
      countSum += pointCount[i][1];
      scoreSum += pointSum[i][1];
    }

    const averageScore = Number((scoreSum / countSum).toFixed(2));
    const starRatingId = starRating.id;

    await this.starRatingRepository.insertTotalScoreOnStarRating(
      averageScore,
      starRatingId,
    );
  }
}
