import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryErrorHandleLibrary } from "src/common/lib/repository-error-handler.library";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { StarRateGeneralRepository } from "./star-rate-general.repository";
import { ErrorHandlerProps } from "src/common/classes/error-handler-props";

@Injectable()
export class StarRateInsertRepository extends ErrorHandlerProps {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
    private readonly repositoryErrorHandler: RepositoryErrorHandleLibrary,
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
      this.repositoryErrorHandler.init<StarRateEntity>(
        new StarRateEntity(),
        this.className,
        this.methodName,
        err,
      );
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
      this.repositoryErrorHandler.init<StarRateEntity>(
        new StarRateEntity(),
        this.className,
        this.methodName,
        err,
      );
    }
  }
}
