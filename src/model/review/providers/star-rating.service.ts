import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../product/providers/product.repository";
import { StarRatingRepository } from "./star-rating.repository";
import { StarRatingEntity } from "./../entities/star-rating.entity";

@Injectable()
export class StarRatingService {
  constructor(
    private readonly productRepository: ProductRepository,
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

    const starRatingId = product.starRating.id;
    const starRating = await this.starRatingRepository.findStarRatingWithId(
      starRatingId,
    );

    this.starRatingRepository.starRatingIncreaseAndSum(
      starRating,
      userSelectScore,
    );

    return starRating;
  }

  async calculateRating(starRating: StarRatingEntity) {
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

    const countSum: number =
      pointCount[0][1] +
      pointCount[1][1] +
      pointCount[2][1] +
      pointCount[3][1] +
      pointCount[4][1];

    const scoreSum: number =
      pointSum[0][1] +
      pointSum[1][1] +
      pointSum[2][1] +
      pointSum[3][1] +
      pointSum[4][1];

    const averageScore = Number((scoreSum / countSum).toFixed(2));
    const starRatingId = starRating.id;

    await this.starRatingRepository.insertTotalScoreOnStarRating(
      averageScore,
      starRatingId,
    );
  }
}
