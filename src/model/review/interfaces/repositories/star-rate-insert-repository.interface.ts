import { ProductEntity } from "src/model/product/entities/product.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";

export interface IStarRateInsertRepository {
  renewTotalScore(averageScore: number, starRateId: string): Promise<void>;
  insertProductIdOnStarRate(
    starRate: StarRateEntity,
    product: ProductEntity,
  ): Promise<void>;
}
