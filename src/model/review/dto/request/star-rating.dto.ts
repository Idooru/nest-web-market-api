import { StarRateScore } from "../../types/star-rate-score.type";
import { StarRateEntity } from "../../entities/star-rate.entity";

export class StarRatingDto {
  starRateScore: StarRateScore;
  starRate: StarRateEntity;
}
