import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { ReviewEntity } from "../entities/review.entity";

export class StarRateRepository {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly StarRateRepository: Repository<StarRateEntity>,
  ) {}

  async createStarRateSample(): Promise<StarRateEntity> {
    const StarRate = this.StarRateRepository.create({});
    return await this.StarRateRepository.save(StarRate);
  }

  async starRatingAndSum(
    StarRate: StarRateEntity,
    userSelectScore: number,
  ): Promise<void> {
    switch (userSelectScore) {
      case 1:
        ++StarRate.onePointCount;
        StarRate.onePointSum += userSelectScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 2:
        ++StarRate.twoPointCount;
        StarRate.twoPointSum += userSelectScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 3:
        ++StarRate.threePointCount;
        StarRate.threePointSum += userSelectScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 4:
        ++StarRate.fourPointCount;
        StarRate.fourPointSum += userSelectScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 5:
        ++StarRate.fivePointCount;
        StarRate.fivePointSum += userSelectScore;
        await this.StarRateRepository.save(StarRate);
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
        await this.StarRateRepository.save(StarRate);
        break;
      case 2:
        --StarRate.twoPointCount;
        StarRate.twoPointSum -= beforeScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 3:
        --StarRate.threePointCount;
        StarRate.threePointSum -= beforeScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 4:
        --StarRate.fourPointCount;
        StarRate.fourPointSum -= beforeScore;
        await this.StarRateRepository.save(StarRate);
        break;
      case 5:
        --StarRate.fivePointCount;
        StarRate.fivePointSum -= beforeScore;
        await this.StarRateRepository.save(StarRate);
        1;
        break;
    }
  }

  async modifyStarRateng(
    StarRate: StarRateEntity,
    userSelectScore: number,
    review: ReviewEntity,
  ) {
    const beforeScore = review.userSelectScore;
    if (beforeScore === userSelectScore) return;

    await this.decreaseStarRateAndMinus(StarRate, beforeScore);
    await this.starRatingAndSum(StarRate, userSelectScore);
  }

  async findStarRateWithId(StarRateId: string): Promise<StarRateEntity> {
    return await this.StarRateRepository.createQueryBuilder("StarRate")
      .where("StarRate.id = :id", { id: StarRateId })
      .getOne();
  }

  async insertTotalScoreOnStarRate(averageScore: number, StarRateId: string) {
    const StarRate = await this.findStarRateWithId(StarRateId);

    StarRate.averageScore = averageScore;
    await this.StarRateRepository.save(StarRate);
    // await this.StarRateRepository.update(id, { averageScore });
  }

  async insertProductIdOnStarRate(
    StarRate: StarRateEntity,
    product: ProductEntity,
  ) {
    try {
      await this.StarRateRepository.createQueryBuilder()
        .update(StarRateEntity)
        .set({ Product: product })
        .where("id = :id", { id: StarRate.id })
        .execute();
    } catch (err) {
      console.error(err);
    }
  }
}
