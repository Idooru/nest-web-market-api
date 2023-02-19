import { Injectable } from "@nestjs/common";
import { ProductGeneralRepository } from "../../product/repositories/product-general.repository";
import { StarRatingRepository } from "./star-rating.repository";
import { StarRatingEntity } from "./../entities/star-rating.entity";
import { ReviewEntity } from "../entities/review.entity";

@Injectable()
export class StarRatingService {
  constructor(
    private readonly productRepository: ProductGeneralRepository,
    private readonly starRatingRepository: StarRatingRepository,
  ) {}

  async increateStarRating(
    userSelectScore: number,
    productId: string,
  ): Promise<StarRatingEntity> {
    const product =
      await this.productRepository.findProductWhenUseStarRatingWithId(
        productId,
      );
    const starRatingId = product.StarRating.id;
    const starRating = await this.starRatingRepository.findStarRatingWithId(
      starRatingId,
    );
    this.starRatingRepository.increaseStarRatingAndSum(
      starRating,
      userSelectScore,
    );
    return starRating;
  }

  async modifyStarRating(
    userSelectScore: number,
    productId: string,
    review: ReviewEntity,
  ): Promise<StarRatingEntity> {
    const product =
      await this.productRepository.findProductWhenUseStarRatingWithId(
        productId,
      );

    const starRatingId = product.StarRating.id;
    const starRating = await this.starRatingRepository.findStarRatingWithId(
      starRatingId,
    );

    this.starRatingRepository.modifyStarRating(
      starRating,
      userSelectScore,
      review,
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

    const averageScore = +(scoreSum / countSum).toFixed(2);
    const starRatingId = starRating.id;

    await this.starRatingRepository.insertTotalScoreOnStarRating(
      averageScore,
      starRatingId,
    );
  }
}
