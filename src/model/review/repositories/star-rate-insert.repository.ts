import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RepositoryLogger } from "src/common/classes/repository.logger";
import { ProductEntity } from "src/model/product/entities/product.entity";
import { Repository } from "typeorm";
import { StarRateEntity } from "../entities/star-rate.entity";
import { StarRateGeneralRepository } from "./star-rate-general.repository";

@Injectable()
export class StarRateInsertRepository extends RepositoryLogger {
  constructor(
    @InjectRepository(StarRateEntity)
    private readonly starRateRepository: Repository<StarRateEntity>,
    private readonly starRateGeneralRepository: StarRateGeneralRepository,
  ) {
    super("Star Rate Insert");
  }

  async renewTotalScore(averageScore: number, starRateId: string) {
    try {
      const StarRate = await this.starRateGeneralRepository.findStarRateWithId(
        starRateId,
      );

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
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
