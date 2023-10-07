import { ReviewEntity } from "../entities/review.entity";
import { StarRateEntity } from "../entities/star-rate.entity";

export class ModifyStarRateDto {
  scoreChosenByClient: 1 | 2 | 3 | 4 | 5;
  starRate: StarRateEntity;
  review: ReviewEntity;
}
