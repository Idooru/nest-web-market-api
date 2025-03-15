import { StarRateEntity } from "../entities/star-rate.entity";
import { StarRateScore } from "../types/star-rate-score.type";

export class StarRatingDto {
  starRateScore: StarRateScore;
  starRate: StarRateEntity;
}
