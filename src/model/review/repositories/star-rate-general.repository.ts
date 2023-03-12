import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

@Injectable()
export class StarRateRepository {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
  ) {}

  private readonly logger = new Logger("Repositroy");

  async createStarRateSample(): Promise<StarRateEntity> {
    try {
      const StarRate = this.starRateRepository.create({});
      return await this.starRateRepository.save(StarRate);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async increaseStarRate(
    StarRate: StarRateEntity,
    scoreChosenByClient: number,
  ): Promise<void> {
    try {
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
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async decreaseStarRate(
    StarRate: StarRateEntity,
    beforeScore: number,
  ): Promise<void> {
    try {
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
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findStarRateWithId(StarRateId: string): Promise<StarRateEntity> {
    try {
      return await this.starRateRepository
        .createQueryBuilder()
        .select(["starRate"])
        .from(StarRateEntity, "starRate")
        .where("starRate.id = :id", { id: StarRateId })
        .getOne();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async insertTotalScoreOnStarRate(averageScore: number, starRateId: string) {
    try {
      const StarRate = await this.findStarRateWithId(starRateId);

      StarRate.averageScore = averageScore;
      await this.starRateRepository.save(StarRate);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
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
