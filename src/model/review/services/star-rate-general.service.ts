import { Injectable } from "@nestjs/common";
import { StarRateRepository } from "../repositories/star-rate-general.repository";
import { StarRateEntity } from "../entities/star-rate.entity";
import { ReviewEntity } from "../entities/review.entity";
import { ProductGeneralRepository } from "src/model/product/repositories/product-general.repository";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ModifyReviewDto } from "../dto/modify-review.dto";

@Injectable()
export class StarRateService {
  constructor(
    private readonly productGeneralRepository: ProductGeneralRepository,
    private readonly starRateRepository: StarRateRepository,
  ) {}

  async starRating(
    createReviewDto: CreateReviewDto,
    productId: string,
  ): Promise<void> {
    const { userSelectScore } = createReviewDto;
    const product =
      await this.productGeneralRepository.findProductWhenUseStarRateWithId(
        productId,
      );
    const StarRate = await this.starRateRepository.findStarRateWithId(
      product.StarRate.id,
    );

    this.starRateRepository.starRatingAndSum(StarRate, userSelectScore);
    await this.calculateRating(StarRate);
  }

  async modifyStarRate(
    modifyReviewDto: ModifyReviewDto,
    productId: string,
    review: ReviewEntity,
  ): Promise<void> {
    const { userSelectScore } = modifyReviewDto;
    const product =
      await this.productGeneralRepository.findProductWhenUseStarRateWithId(
        productId,
      );
    const StarRate = await this.starRateRepository.findStarRateWithId(
      product.StarRate.id,
    );

    this.starRateRepository.modifyStarRateng(StarRate, userSelectScore, review);
    await this.calculateRating(StarRate);
  }

  async calculateRating(StarRate: StarRateEntity): Promise<void> {
    const StarRateProperty = Object.entries(StarRate);
    const pointSum = [];
    const pointCount = [];

    for (const idx of StarRateProperty) {
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
    const StarRateId = StarRate.id;

    await this.starRateRepository.insertTotalScoreOnStarRate(
      averageScore,
      StarRateId,
    );
  }
}
