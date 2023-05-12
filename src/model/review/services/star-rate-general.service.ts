import { Injectable } from "@nestjs/common";
import { StarRateGeneralRepository } from "../repositories/star-rate-general.repository";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { StarRatingDto } from "../dto/star-rating.dto";
import { ModifyStarRateDto } from "../dto/modify-star-rate.dto";
import { IStarRateGeneralService } from "../interfaces/services/star-rate-general-service.interface";

@Injectable()
export class StarRateGeneralService implements IStarRateGeneralService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
  ) {}

  async starRating(starRatingDto: StarRatingDto): Promise<void> {
    const {
      reviewRequestDto: { scoreChosenByClient },
      productId,
    } = starRatingDto;

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

  async modifyStarRate(modifyStarRate: ModifyStarRateDto): Promise<void> {
    const {
      reviewRequestDto: { scoreChosenByClient },
      productId,
      review,
    } = modifyStarRate;

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
