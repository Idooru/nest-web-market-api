import { Injectable } from "@nestjs/common";
import { StarRateGeneralRepository } from "../repositories/star-rate-general.repository";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { ReviewRequestDto } from "../dto/review-request.dto";

@Injectable()
export class StarRateGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
  ) {}

  async starRating(
    reviewRequestDto: ReviewRequestDto,
    productId: string,
  ): Promise<void> {
    const { scoreChosenByClient } = reviewRequestDto;
    const product =
      await this.productGeneralRepository.findProductOneJustNeedStarRate(
        productId,
      );
    const starRate = await this.starRateGeneralRepository.findStarRateWithId(
      product.StarRate.id,
    );

    await this.starRateGeneralRepository.increaseStarRate(
      starRate,
      scoreChosenByClient,
    );
    await this.calculateStarRate(starRate);
  }

  async modifyStarRate(
    reviewRequestDto: ReviewRequestDto,
    productId: string,
    review: ReviewEntity,
  ): Promise<void> {
    const { scoreChosenByClient } = reviewRequestDto;
    const product =
      await this.productGeneralRepository.findProductOneJustNeedStarRate(
        productId,
      );
    const starRate = await this.starRateGeneralRepository.findStarRateWithId(
      product.StarRate.id,
    );

    const beforeScore = review.scoreChosenByClient;
    if (beforeScore === scoreChosenByClient) {
      return;
    }

    await Promise.all([
      this.starRateGeneralRepository.decreaseStarRate(starRate, beforeScore),
      this.starRateGeneralRepository.increaseStarRate(
        starRate,
        scoreChosenByClient,
      ),
    ]);

    await this.calculateStarRate(starRate);
  }

  async decreaseStarRate(review: ReviewEntity): Promise<void> {
    const product =
      await this.productGeneralRepository.findProductOneJustNeedStarRate(
        review.Product.id,
      );
    const starRate = await this.starRateGeneralRepository.findStarRateWithId(
      product.StarRate.id,
    );

    const beforeScore = review.scoreChosenByClient;

    await this.starRateGeneralRepository.decreaseStarRate(
      starRate,
      beforeScore,
    );

    await this.calculateStarRate(starRate);
  }

  async calculateStarRate(starRate: StarRateEntity): Promise<void> {
    const starRateProperty = Object.entries(starRate);

    const sum: number = starRateProperty
      .filter((prop) => prop[0].includes("PointSum"))
      .map((arr) => arr[1])
      .reduce((acc, cur) => acc + cur, 0);

    const count: number = starRateProperty
      .filter((prop) => prop[0].includes("PointCount"))
      .map((arr) => arr[1])
      .reduce((acc, cur) => acc + cur, 0);

    const number = Number((sum / count).toFixed(2));
    const averageScore = isNaN(number) ? 0 : number;

    starRate.averageScore = averageScore;

    await this.starRateGeneralRepository.renewTotalScore(starRate);
  }
}
