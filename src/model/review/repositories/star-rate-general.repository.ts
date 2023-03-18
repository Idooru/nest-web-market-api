import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RepositoryLogger } from "src/common/classes/repository.logger";

@Injectable()
export class StarRateGeneralRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
  ) {
    super("Star Rate");
  }

  async createStarRateSample(): Promise<StarRateEntity> {
    try {
      const starRate = this.starRateRepository.create({});
      return await this.starRateRepository.save(starRate);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async increaseStarRate(
    starRate: StarRateEntity,
    scoreChosenByClient: number,
  ): Promise<void> {
    try {
      switch (scoreChosenByClient) {
        case 1:
          ++starRate.onePointCount;
          starRate.onePointSum += scoreChosenByClient;
          await this.starRateRepository.save(starRate);
          break;
        case 2:
          ++starRate.twoPointCount;
          starRate.twoPointSum += scoreChosenByClient;
          await this.starRateRepository.save(starRate);
          break;
        case 3:
          ++starRate.threePointCount;
          starRate.threePointSum += scoreChosenByClient;
          await this.starRateRepository.save(starRate);
          break;
        case 4:
          ++starRate.fourPointCount;
          starRate.fourPointSum += scoreChosenByClient;
          await this.starRateRepository.save(starRate);
          break;
        case 5:
          ++starRate.fivePointCount;
          starRate.fivePointSum += scoreChosenByClient;
          await this.starRateRepository.save(starRate);
          break;
      }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async decreaseStarRate(
    starRate: StarRateEntity,
    beforeScore: number,
  ): Promise<void> {
    try {
      switch (beforeScore) {
        case 1:
          --starRate.onePointCount;
          starRate.onePointSum -= beforeScore;
          await this.starRateRepository.save(starRate);
          break;
        case 2:
          --starRate.twoPointCount;
          starRate.twoPointSum -= beforeScore;
          await this.starRateRepository.save(starRate);
          break;
        case 3:
          --starRate.threePointCount;
          starRate.threePointSum -= beforeScore;
          await this.starRateRepository.save(starRate);
          break;
        case 4:
          --starRate.fourPointCount;
          starRate.fourPointSum -= beforeScore;
          await this.starRateRepository.save(starRate);
          break;
        case 5:
          --starRate.fivePointCount;
          starRate.fivePointSum -= beforeScore;
          await this.starRateRepository.save(starRate);
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

  async renewTotalScore(starRate: StarRateEntity): Promise<void> {
    try {
      await this.starRateRepository
        .createQueryBuilder()
        .update()
        .set({ ...starRate })
        .where("id = :id", { id: starRate.id })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
