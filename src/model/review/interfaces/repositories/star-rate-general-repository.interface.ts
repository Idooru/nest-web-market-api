import { StarRateEntity } from "../../entities/star-rate.entity";

export interface IStarRateGeneralRepository {
  createStarRateSample(): Promise<StarRateEntity>;
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
