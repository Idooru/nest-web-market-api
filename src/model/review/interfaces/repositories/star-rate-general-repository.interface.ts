import { ProductEntity } from "src/model/product/entities/product.entity";
import { StarRateEntity } from "../../entities/star-rate.entity";

export interface IStarRateGeneralRepository {
  createStarRate(product: ProductEntity): Promise<void>;
  increaseStarRate(
    starRate: StarRateEntity,
    scoreChosenByClient: number,
  ): Promise<void>;
  decreaseStarRate(
    starRate: StarRateEntity,
    beforeScore: number,
  ): Promise<void>;
  findStarRateWithId(StarRateId: string): Promise<StarRateEntity>;
  renewTotalScore(starRate: StarRateEntity): Promise<void>;
}
