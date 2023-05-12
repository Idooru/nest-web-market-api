import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { StarRateGeneralRepository } from "./star-rate-general.repository";
import { ErrorHandlerProps } from "src/common/classes/abstract/error-handler-props";
import { TypeOrmErrorHandlerBuilder } from "src/common/lib/error-handler/typeorm-error-handler.builder";
import { StarRateErrorCase } from "../error/star-rate-error.handler";

@Injectable()
export class StarRateInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
    private readonly typeOrmErrorHandlerBuilder: TypeOrmErrorHandlerBuilder,
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(StarRateErrorCase)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
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
      this.typeOrmErrorHandlerBuilder
        .setErrorHandler(StarRateErrorCase)
        .setError(err)
        .setSourceNames(this.className, this.methodName)
        .handle();
    }
  }
}
