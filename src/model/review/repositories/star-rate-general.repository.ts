import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";
import { ReviewSelectProperty } from "src/common/config/repository-select-configs/review-select";

@Injectable()
export class StarRateGeneralRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
    @Inject("ReviewSelectProperty")
    private readonly select: ReviewSelectProperty,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder<unknown>,
  ) {
    super();
  }

  async createStarRateSample(): Promise<StarRateEntity> {
    try {
      const starRate = this.starRateRepository.create({});
      return await this.starRateRepository.save(starRate);
    } catch (err) {
      this.methodName = this.createStarRateSample.name;
      this.errorHandlerBuilder
        .setEntity(new StarRateEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.increaseStarRate.name;
      this.errorHandlerBuilder
        .setEntity(new StarRateEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.decreaseStarRate.name;
      this.errorHandlerBuilder
        .setEntity(new StarRateEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }

  async findStarRateWithId(StarRateId: string): Promise<StarRateEntity> {
    try {
      return await this.starRateRepository
        .createQueryBuilder()
        .select(this.select.starRateSelect)
        .from(StarRateEntity, "starRate")
        .where("starRate.id = :id", { id: StarRateId })
        .getOneOrFail();
    } catch (err) {
      this.methodName = this.findStarRateWithId.name;
      this.errorHandlerBuilder
        .setEntity(new StarRateEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.renewTotalScore.name;
      this.errorHandlerBuilder
        .setEntity(new StarRateEntity())
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
