import { ReviewEntity } from "../entities/review.entity";
import { StarRateEntity } from "../entities/star-rate.entity";
import { StarRateScore } from "../types/star-rate-score.type";

export class ModifyStarRateDto {
  review: ReviewEntity;
  starRateScore: StarRateScore;
  starRate: StarRateEntity;
}
