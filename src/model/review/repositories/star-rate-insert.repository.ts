import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { EntityTarget, Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { StarRateGeneralRepository } from "./star-rate-general.repository";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";
import { ErrorHandlerBuilder } from "src/common/lib/error-handler/error-hanlder-builder";

@Injectable()
export class StarRateInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
    private readonly errorHandlerBuilder: ErrorHandlerBuilder,
  ) {
    super();
  }

  async renewTotalScore(averageScore: number, starRateId: string) {
    try {
      const StarRate = await this.starRateGeneralRepository.findStarRateWithId(
        starRateId,
      );

      StarRate.averageScore = averageScore;
      await this.starRateRepository.save(StarRate);
    } catch (err) {
      this.methodName = this.renewTotalScore.name;
      this.errorHandlerBuilder
        .setEntity(StarRateEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
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
      this.methodName = this.insertProductIdOnStarRate.name;
      this.errorHandlerBuilder
        .setEntity(StarRateEntity)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .setLayer("repository")
        .handle();
    }
  }
}
