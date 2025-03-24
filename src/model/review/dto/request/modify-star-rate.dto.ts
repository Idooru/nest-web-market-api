import { ReviewEntity } from "../../entities/review.entity";
import { StarRateScore } from "../../types/star-rate-score.type";
import { StarRateEntity } from "../../entities/star-rate.entity";

export class ModifyStarRateDto {
  review: ReviewEntity;
  starRateScore: StarRateScore;
  starRate: StarRateEntity;
}
