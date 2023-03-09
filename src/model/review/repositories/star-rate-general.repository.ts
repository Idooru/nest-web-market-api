import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "../entities/review.entity";

export class StarRateRepository {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
  ) {}

  async createStarRateSample(): Promise<StarRateEntity> {
    const StarRate = this.starRateRepository.create({});
    return await this.starRateRepository.save(StarRate);
  }

  async starRatingAndSum(
    StarRate: StarRateEntity,
    scoreChosenByClient: number,
  ): Promise<void> {
    switch (scoreChosenByClient) {
      case 1:
        ++StarRate.onePointCount;
        StarRate.onePointSum += scoreChosenByClient;
        await this.starRateRepository.save(StarRate);
        break;
      case 2:
        ++StarRate.twoPointCount;
        StarRate.twoPointSum += scoreChosenByClient;
        await this.starRateRepository.save(StarRate);
        break;
      case 3:
        ++StarRate.threePointCount;
        StarRate.threePointSum += scoreChosenByClient;
        await this.starRateRepository.save(StarRate);
        break;
      case 4:
        ++StarRate.fourPointCount;
        StarRate.fourPointSum += scoreChosenByClient;
        await this.starRateRepository.save(StarRate);
        break;
      case 5:
        ++StarRate.fivePointCount;
        StarRate.fivePointSum += scoreChosenByClient;
        await this.starRateRepository.save(StarRate);
        break;
    }
  }

  async decreaseStarRateAndMinus(
    StarRate: StarRateEntity,
    beforeScore: number,
  ): Promise<void> {
    switch (beforeScore) {
      case 1:
        --StarRate.onePointCount;
        StarRate.onePointSum -= beforeScore;
        await this.starRateRepository.save(StarRate);
        break;
      case 2:
        --StarRate.twoPointCount;
        StarRate.twoPointSum -= beforeScore;
        await this.starRateRepository.save(StarRate);
        break;
      case 3:
        --StarRate.threePointCount;
        StarRate.threePointSum -= beforeScore;
        await this.starRateRepository.save(StarRate);
        break;
      case 4:
        --StarRate.fourPointCount;
        StarRate.fourPointSum -= beforeScore;
        await this.starRateRepository.save(StarRate);
        break;
      case 5:
        --StarRate.fivePointCount;
        StarRate.fivePointSum -= beforeScore;
        await this.starRateRepository.save(StarRate);
        1;
        break;
    }
  }

  async modifyStarRateng(
    StarRate: StarRateEntity,
    scoreChosenByClient: number,
    review: ReviewEntity,
  ) {
    const beforeScore = review.scoreChosenByClient;
    if (beforeScore === scoreChosenByClient) return;

    await this.decreaseStarRateAndMinus(StarRate, beforeScore);
    await this.starRatingAndSum(StarRate, scoreChosenByClient);
  }

  async findStarRateWithId(StarRateId: string): Promise<StarRateEntity> {
    return await this.starRateRepository
      .createQueryBuilder("StarRate")
      .where("StarRate.id = :id", { id: StarRateId })
      .getOne();
  }

  async insertTotalScoreOnStarRate(averageScore: number, starRateId: string) {
    const StarRate = await this.findStarRateWithId(starRateId);

    StarRate.averageScore = averageScore;
    await this.starRateRepository.save(StarRate);
    // await this.starRateRepository.update(id, { averageScore });
  }

  async insertProductIdOnStarRate(
    starRate: StarRateEntity,
    product: ProductEntity,
  ) {
    try {
      await this.starRateRepository
        .createQueryBuilder()
        .update(StarRateEntity)
        .set({ Product: product })
        .where("id = :id", { id: starRate.id })
        .execute();
    } catch (err) {
      console.error(err);
    }
  }
}
